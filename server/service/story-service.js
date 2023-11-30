const {Story, User, Activity} = require('../models/models');
// const { Op } = require("sequelize");



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
    });
    const idUsers = stories.map(item => item.dataValues.userId);
    const users = await User.findAll({
      where: { id: idUsers},
      attributes: ['id', 'username', 'refUser', 'profilePic']
    });
    const indexesToDelete = [];
    const storiesForClient = getFullDataStories(users, stories, id, indexesToDelete);
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
    const story = await Story.findOne({
      order: [['createdAt', 'DESC']],
    });
    const user = await User.findOne(
      {
        where: {id: userId},
      },
    );
    const indexesToDelete = [];
    getFullDataStories(user, stories, indexesToDelete);
    return story;
  } 

}

function getFullDataStories(users, stories, userId, indexesToDelete) {
  const obj = {};
  const newArrStories = [];
  let key;
  let item;
  for (let i = 0; i < users.length; i++) {
    key = users[i].dataValues.id;
    obj[key] = users[i].dataValues;
  }
  for (let i = 0; i < stories.length; i++) {
    key = stories[i].dataValues.userId;
    item = stories[i].dataValues;
    if (obj[key]) {
      item.date = formatAndCheckDate(item.createdAt, () => indexesToDelete.push(item.id));
      item.username = obj[key].username;
      item.refUser = obj[key].refUser;
      item.profilePic = obj[key].profilePic;
    }
    if (stories[i].length > 1) {
      if (stories[i].dataValues.userId === userId) {
        newArrStories[0] = stories[i];
      }
      if (stories[i].dataValues.userId !== userId) {
        newArrStories[i + 1] = stories[i];
      }
    }
  }
  return newArrStories.length ? newArrStories : stories;
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