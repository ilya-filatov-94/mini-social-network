const {Story, User} = require('../models/models');
const formatRelativeDate = require('../helpers/dateFormatting');


class StoryService {
  async createNewStory(userId, fileName) {
    if (!userId || !fileName) return;
    const story = await Story.create({
      image: fileName,
      userId: userId,
    });
    return story;
  }

  async getAllStories() {
    const stories = await Story.findAll({
      order: [['createdAt', 'DESC']],
    });
    const users = await User.findAll({
      attributes: ['id', 'username', 'refUser', 'profilePic']
    });
    getFullDataStories(users, stories);
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
    getFullDataStories(user, stories);
    return story;
  } 

}

function getFullDataStories(users, stories) {
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
      item.date = formatRelativeDate(date);
      item.username = obj[key].username;
      item.refUser = obj[key].refUser;
      item.profilePic = obj[key].profilePic;
    }
  }
}


module.exports = new StoryService();