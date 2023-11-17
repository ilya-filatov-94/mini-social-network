const {Story, User} = require('../models/models');
const { Op } = require("sequelize");



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
    const stories = await Story.findAll({
      where: {
        userId: {
          [Op.ne]: id
        }
      },
      order: [['createdAt', 'DESC']],
    });
    const curUserStory = await Story.findAll({where: {userId: id},});
    stories.push(...curUserStory);
    const users = await User.findAll({
      attributes: ['id', 'username', 'refUser', 'profilePic']
    });
    const indexesToDelete = [];
    getFullDataStories(users, stories, indexesToDelete);
    if (indexesToDelete.length !== 0) {
      await Story.destroy({
        where: { id: indexesToDelete},
      });
      return stories.filter(item => !indexesToDelete.includes(item.dataValues.id))
    }
    return stories;
  }

  async getOneStory(userId) {
    if (!userId) return;
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

function getFullDataStories(users, stories, indexesToDelete) {
  const obj = {};
  let key;
  let item;
  let date;
  for (let i = 0; i < users.length; i++) {
    key = users[i].dataValues.id;
    obj[key] = users[i].dataValues;
  }
  for (let i = 0; i < stories.length; i++) {
    key = stories[i].dataValues.userId;
    item = stories[i].dataValues;
    if (obj[key]) {
      date = new Date(Date.parse(item.createdAt));
      item.date = formatAndCheckDate(date, () => indexesToDelete.push(item.id));
      item.username = obj[key].username;
      item.refUser = obj[key].refUser;
      item.profilePic = obj[key].profilePic;
    }
  }
}

function formatAndCheckDate(inputDate, callback) {
  let diff = new Date() - inputDate;

  if (diff < 1000) {
    return "прямо сейчас";
  }

  let sec = Math.floor(diff / 1000);
  if (sec < 60) {
    return sec + " сек. назад";
  }

  let min = Math.floor(diff / 60000);
  if (min < 60) {
    return min + " мин. назад";
  }

  let hours = Math.floor(diff / (3600*1000));
  if (hours === 1) return hours + " час назад";
  if (hours <= 4 && hours >= 2) return hours + " часа назад";
  if (hours >= 24) {
    callback();
  }
  if (hours > 5) return hours + " часов назад";
}


module.exports = new StoryService();