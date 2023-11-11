const {Post, User, Like} = require('../models/models');
const formatRelativeDate = require('../helpers/dateFormatting');



class PostService {
  async createNewPost(userId, desc, fileName) {
    const post = await Post.create({
      userId: userId,
      desc: desc,
      image: fileName,
    });
    return post;
  }

  async getAll(userId) {
    if (!userId) return [];
    const posts = await Post.findAll({
      where: { userId: userId },
      order: [['createdAt', 'DESC']],
      attributes: [
        "id",
        "desc",
        "image",
        "counterLikes",
        "counterComments",
        "createdAt"
      ],
    });
    const users = await User.findOne({
      where: { id: userId },
      attributes: ["id", "username", "refUser", "profilePic"],
    });
    for (let item of posts) {
      let post = item.dataValues;
      let date = new Date(Date.parse(post.createdAt));
      post.date = formatRelativeDate(date);
      post.username = users.dataValues.username;
      post.refUser = users.dataValues.refUser;
      post.profilePic = users.dataValues.profilePic;
    }
    return posts;
  }

  async getLatestPosts() {
    const posts = await Post.findAll({
      order: [['createdAt', 'DESC']],
      attributes: [
        "id",
        "desc",
        "image",
        "counterLikes",
        "counterComments",
        "updatedAt",
      ],
    });
    const users = await User.findAll({
      attributes: ["id", "username", "refUser", "profilePic"],
    });

    for (let item of posts) {
      let post = item.dataValues;
      let date = new Date(Date.parse(post.createdAt));
      post.date = formatRelativeDate(date);
      post.username = users.dataValues.username;
      post.refUser = users.dataValues.refUser;
      post.profilePic = users.dataValues.profilePic;
    }
    return posts;
  }

  async updatePost(id, desc, fileName) {
    await Post.update({ desc: desc, image: fileName}, {
      where: {
        id: id,
      },
    });
    const post = await Post.findOne({where: {id}})
    return post;
  }

  async deletePost(id) {
    if (id) {
      return await Post.destroy({
        where: {
          id: id,
        },
      }) ? id : 0;
    }
    return 0;
  }

  async addLike(userId, postId) {
    const like = await Like.create({
      userId: userId,
      postId: postId
    });
    return like;
  }

  async removeLike(userId, postId) {
    if (!userId || !postId) return 0;
    return await Like.destroy({
      where: { userId,  postId},
    }) ? {userId, postId} : 0;
  }

  async getLikes(userId, postId) {
    if (!userId || !postId) return [];
    const likes = await Like.findAll({
      where: { userId: userId,  postId: postId},
      attributes: [
        "id",
        "userId",
        "postId"
      ],
    });
    const users = await User.findAll({
      attributes: ["id", "username", "refUser", "profilePic"],
    });
    getFullDataLikes(users, likes)
    return likes;
  }
}

function getFullDataLikes(users, likes) {
  const obj = {};
  let key;
  let item;
  for (let i = 0; i < users.length; i++) {
    key = users[i].dataValues.id;
    obj[key] = users[i].dataValues;
  }
  for (let i = 0; i < likes.length; i++) {
    key = likes[i].dataValues.userId;
    item = likes[i].dataValues;
    if (obj[key]) {
      item.username = obj[key].username;
      item.refUser = obj[key].refUser;
      item.profilePic = obj[key].profilePic;
    }
  }
}

module.exports = new PostService();