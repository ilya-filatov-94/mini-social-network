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
      return storiesForClient.filter(item => !indexesToDelete.includes(item));
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
      checkDate(item.createdAt, () => indexesToDelete.push(item.id))
      return {
        id: item.id,
        image: item.image,
        userId: item.userId,
        date: item.createdAt,
        username: item.user.dataValues.username,
        refUser: item.user.dataValues.refUser,
        profilePic: item.user.dataValues.profilePic,
      }
    });
    return flatStories || [];
  } 

}

function getFullDataStories(stories, userId, indexesToDelete) {
  let item;
  let indexStoryCurUser;
  const shaffleStories = [];
  const flatStories = stories.map((story, index) => {
    item = story.dataValues;
    if (item.userId === userId) indexStoryCurUser = index;
    checkDate(item.createdAt, () => indexesToDelete.push(item.id));
    return {
      id: item.id,
      image: item.image,
      userId: item.userId,
      date: item.createdAt,
      username: item.user.dataValues.username,
      refUser: item.user.dataValues.refUser,
      profilePic: item.user.dataValues.profilePic,
    }
  });
  if (indexStoryCurUser !== undefined) {
    shaffleStories.push(flatStories[indexStoryCurUser]);
  }
  for (const story of flatStories) {
    if (story.userId !== userId) {
      shaffleStories.push(story);
    }
  }
  return shaffleStories || [];
}

function checkDate(inputDate, callback) {
  const createdDate = new Date(inputDate).getTime();
  const curDate = Date.now();
  const deltaSeconds = Math.floor((curDate - createdDate)/1000);
  const oneDaySeconds = 86400;
  if (deltaSeconds >= oneDaySeconds) {
    callback();
  }
}


module.exports = new StoryService();