const {Comment, User, Post} = require('../models/models');
const formatRelativeDate = require('../helpers/dateFormatting');


class CommentService {
  async createNewComment(id_user, id_post, desc) {
    if (!id_user || !id_post || !desc) return {};
    const comment = await Comment.create({
      desc: desc,
      userId: id_user,
      postId: id_post,
    });
    const user = await User.findOne({where: {id: id_user}});
    comment.dataValues.username = user.username;
    comment.dataValues.refUser = user.refUser;
    comment.dataValues.profilePic = user.profilePic;
    let date = new Date(Date.parse(comment.dataValues.createdAt));
    comment.dataValues.date = formatRelativeDate(date);

    const post = await Post.findOne({where: {id: id_post}})
    await Post.update({ counterComments: parseInt(post.counterComments)+1}, {
      where: {id: id_post},
    });
    return comment;
  }

  async getAll(id_user, id_post) {
    if (!id_user || !id_post) return [];
    const comments = await Comment.findAll({
      where: { userId: id_user,  postId: id_post},
      order: [['createdAt', 'DESC']],
      attributes: [
        "id",
        "desc",
        "createdAt",
        "userId",
        "postId"
      ],
    });
    const idUsers = comments.map(item => item.dataValues.userId);
    const users = await User.findAll({
      where: { id: idUsers},
      attributes: ['id', 'username', 'refUser', 'profilePic']
    });
    getFullDataComments(users, comments);
    return comments;
  }

  async deleteComment(id_post, id_com) {
    if (!id_post || !id_com) return 0;
    const post = await Post.findOne({where: {id: id_post}})
    await Post.update({ counterComments: parseInt(post.counterComments)-1}, {
      where: {id: id_post},
    });
    return await Comment.destroy({
      where: { id: id_com,  postId: id_post},
    }) ? id_com : 0;
  }
}

function getFullDataComments(users, comments) {
  const obj = {};
  let key;
  let item;
  let date;
  for (let i = 0; i < users.length; i++) {
    key = users[i].dataValues.id;
    obj[key] = users[i].dataValues;
  }
  for (let i = 0; i < comments.length; i++) {
    key = comments[i].dataValues.userId;
    item = comments[i].dataValues;
    if (obj[key]) {
      date = new Date(Date.parse(item.createdAt));
      item.date = formatRelativeDate(date);
      item.username = obj[key].username;
      item.refUser = obj[key].refUser;
      item.profilePic = obj[key].profilePic;
    }
  }
}

module.exports = new CommentService();