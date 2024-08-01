const {Post, User, Like, Activity} = require('../models/models');

class PostService {
  async createNewPost(userId, desc, fileName) {
    if (!userId) return null;
    const post = await Post.create({
      userId: userId,
      desc: desc,
      image: fileName,
    });
    return post;
  }

  async getAll(userId) {
    if (!userId) return [];
    const postsInfo = await Post.findAll({
      where: {
        userId: userId,
      },
      order: [['createdAt', 'DESC']],
      attributes: [
        "id",
        "desc",
        "image",
        ["updatedAt", "date"],
        "userId",
        "counterComments",
      ],
      include: [{
        model: User,
        attributes: ["id", "username", "refUser", "profilePic"]
      }],
    });
    return postsInfo;
  }

  async getOne(postId) {
    if (!postId) return {};
    const postInfo = await Post.findOne({
      where: {
        id: postId,
      },
      order: [['createdAt', 'DESC']],
      attributes: [
        "id",
        "desc",
        "image",
        ["updatedAt", "date"],
        "userId",
        "counterComments",
      ],
      include: [{
        model: User,
        attributes: ["id","username", "refUser", "profilePic"]
      }],
    });
    return postInfo;
  }

  async updatePost(id, desc, fileName) {
    const [_, affectedRows] =  await Post.update({ desc: desc, image: fileName}, {
      where: {
        id: id,
      },
      returning: true,
    });
    return affectedRows;
  }

  async deletePost(id) {
    if (id) {
      await Activity.destroy({
        where: { idAct: id, type: 'addedPost'},
      });
      return await Post.destroy({
        where: {
          id: id,
        },
      }) ? id : 0;
    }
    return 0;
  }

  async addLike(userId, postId) {
    if (!userId || !postId) return null;
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

  async getLikes(postId) {
    if (!postId) return [];
    const likes = await Like.findAll({
      where: { postId: postId},
      attributes: [
        "id",
        "userId",
        "postId"
      ],
      include: [{
        model: User,
        attributes: ["username", "refUser", "profilePic"]
      }],
    });
    const flatLikes = likes.map(like => (
      {
        id: like.id,
        userId: like.userId,
        postId: like.postId,
        username: like.user.username,
        refUser: like.user.refUser,
        profilePic: like.user.profilePic
      }
    ));
    return flatLikes;
  }
}

module.exports = new PostService();