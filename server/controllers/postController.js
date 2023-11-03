const postService = require('../service/post-service');
const uuid = require('uuid');
const path = require('path');



class PostController {

    async createPost(request, response, next) {
        try {
            const {desc, userId} = request.body;
            const {image} = request.files;
            let fileName = uuid.v4() + ".jpg";
            image.mv(path.resolve(__dirname, '..', 'static', fileName));
            const post = await postService.createNewPost(userId, desc, fileName);
            return response.json(post);
        } catch (error) {
            next(error);
        }
    }

    async getAllPosts(request, response, next) {
        try {
            let {userId} = request.query;
            const posts = await postService.getAll(userId);
            return response.json(posts);
        } catch (error) {
            next(error);
        }
    }

    async getLatestPosts(request, response, next) {
        try {

        } catch (error) {
            next(error);
        }
    }
};

module.exports = new PostController();