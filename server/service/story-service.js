const {Story, User, Activity} = require('../models/models');

class StoryService {
  async createNewStory(userId, fileName) {
    if (!userId || !fileName) return;
    const story = await Story.create({
      image: fileName,
      userId: userId,
    });
    return story;
  }

  async getAllStories(id) {
    if (!id) return [];
    const stories = await Story.findAll({
      order: [['createdAt', 'DESC']],
      include: [{
        model: User,
        attributes: ["username", "refUser", "profilePic"]
      }],
    });
    const indexesToDelete = [];
    const storiesForClient = getFullDataStories(stories, id, indexesToDelete);
    if (indexesToDelete.length !== 0) {
      await Story.destroy({
        where: { id: indexesToDelete},
      });
      await Activity.destroy({
        where: { idAct: indexesToDelete, type: 'addedStory'},
      });
      return storiesForClient.filter(item => !indexesToDelete.includes(item.dataValues.id));
    }
    return storiesForClient;
  }

  async getOneStory(userId) {
    if (!userId) return {};
    const stories = await Story.findOne({
      order: [['createdAt', 'DESC']],
      where: { userId},
      include: [{
        model: User,
        attributes: ["username", "refUser", "profilePic"]
      }],
    });
    const flatStories = stories.map(story => {
      item = story.dataValues;
      const createdAt = formatAndCheckDate(item.createdAt, () => indexesToDelete.push(item.id))
      return {
        id: item.id,
        image: item.image,
        userId: item.userId,
        date: createdAt,
        username: item.user.dataValues.username,
        refUser: item.user.dataValues.refUser,
        profilePic: item.user.dataValues.profilePic,
      }
    });
    return flatStories;
  } 

}

function getFullDataStories(stories, userId, indexesToDelete) {
  let item;
  let indexStoryCurUser;
  const flatStories = stories.map((story, index) => {
    item = story.dataValues;
    if (item.userId === userId) indexStoryCurUser = index;
    const createdAt = formatAndCheckDate(item.createdAt, () => indexesToDelete.push(item.id))
    return {
      id: item.id,
      image: item.image,
      userId: item.userId,
      date: createdAt,
      username: item.user.dataValues.username,
      refUser: item.user.dataValues.refUser,
      profilePic: item.user.dataValues.profilePic,
    }
  });
  if (flatStories.length > 1 && indexStoryCurUser) {
    [flatStories[0], flatStories[indexStoryCurUser]] = [flatStories[indexStoryCurUser], flatStories[0]];
  }
  return flatStories;
}

function formatAndCheckDate(inputDate, callback) {
  const createdDate = new Date(Date.parse(inputDate)).getTime();
  const deltaSeconds = Math.floor((createdDate - Date.now())/1000);
  const offsetTime = [60, 3600, 86400, 86400*7, 86400*30, 86400*365, Infinity];
  const unitIndex = offsetTime.findIndex(offsetTime => offsetTime >= Math.abs(deltaSeconds));
  if (offsetTime[unitIndex] >= 86400) {
    callback();
  }
  return inputDate;
}


module.exports = new StoryService();