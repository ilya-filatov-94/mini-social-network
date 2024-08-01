const {Comment, User, Post, Activity} = require('../models/models');

class CommentService {
  async createNewComment(id_user, id_post, desc) {
    if (!id_user || !id_post || !desc) return {};
    const comment = await Comment.create({
      desc: desc,
      userId: id_user,
      postId: id_post,
    });
    const user = await User.findByPk(id_user);
    comment.dataValues.username = user.username;
    comment.dataValues.refUser = user.refUser;
    comment.dataValues.profilePic = user.profilePic;

    const post = await Post.findByPk(id_post);
    await Post.update({ counterComments: parseInt(post.counterComments)+1}, {
      where: {id: id_post},
    });
    return comment;
  }

  async getAll(id_post) {
    if (!id_post) return [];
    const comments = await Comment.findAll({
      where: { postId: id_post},
      order: [['createdAt', 'DESC']],
      attributes: [
        "id",
        "desc",
        "createdAt",
        "userId",
        "postId"
      ],
      include: [{
        model: User,
        attributes: ["username", "refUser", "profilePic"]
      }],
    });
    if (!comments?.length) return [];
    const flatComments = comments.map(comment => (
      {
        id: comment.id,
        desc: comment.desc,
        date: comment.createdAt,
        userId: comment.userId,
        postId: comment.postId,
        username: comment.user.username,
        refUser: comment.user.refUser,
        profilePic: comment.user.profilePic
      }
    ));
    return flatComments;
  }

  async getOne(commentId) {
    if (!commentId) return {};
    const comment = await Comment.findOne({
      where: { id: commentId},
      order: [['createdAt', 'DESC']],
      attributes: [
        "id",
        "desc",
        "createdAt",
        "userId",
        "postId"
      ],
      include: [{
        model: User,
        attributes: ["username", "refUser", "profilePic"]
      }],
    });
    if (Object.keys(comment).length === 0) return {};
    const flatComment = {
      id: comment.id,
      desc: comment.desc,
      date: comment.createdAt,
      userId: comment.userId,
      postId: comment.postId,
      username: comment.user.username,
      refUser: comment.user.refUser,
      profilePic: comment.user.profilePic
    }
    return flatComment;
  }

  async deleteComment(id_post, id_com) {
    if (!id_post || !id_com) return 0;
    const post = await Post.findByPk(id_post);
    await Post.update({ counterComments: parseInt(post.counterComments)-1}, {
      where: {id: id_post},
    });
    await Activity.destroy({
      where: { idAct: id_com, type: 'addedComment'},
    });
    return await Comment.destroy({
      where: { id: id_com,  postId: id_post},
    }) ? id_com : 0;
  }
}

module.exports = new CommentService();