const {Post} = require('../models/models');




class PostService {
    async createNewPost(userId, desc, fileName) {
        const post = await Post.create({
            userId: userId,
            desc: desc,
            image: fileName
        });
        return post;
    }

    async getAll(userId) {
        let posts;
        if (userId) {
            posts = await Post.findAll({
                where:{userId: userId},
            });
        } else {
            posts = await Post.findAll();
        }
        return posts;
    }
}

module.exports = new PostService();