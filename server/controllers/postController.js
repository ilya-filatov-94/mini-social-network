const postService = require('../service/post-service');
const uuid = require('uuid');
const path = require('path');




class PostController {

    async createPost(request, response, next) {
        try {
            const {id, desc} = request.body;
            let post;
            if (request.files) {
                const {image} = request.files;
                let fileName = uuid.v4() + ".jpg";
                image.mv(path.resolve(__dirname, '..', 'static', fileName));
                post = await postService.createNewPost(parseInt(id), desc, fileName);
            } else {
                post = await postService.createNewPost(parseInt(id), desc, '');
            }
            return response.json(post);
        } catch (error) {
            next(error);
        }
    }

    async getAllPosts(request, response, next) {
        try {
            let {id} = request.query;
            const posts = await postService.getAll(id);
            return response.json(posts);
        } catch (error) {
            next(error);
        }
    }

    async getLatestPosts(request, response, next) {
        try {
            const posts = await postService.getLatestPosts();
            return response.json(posts);
        } catch (error) {
            next(error);
        }
    }

    async updatePost(request, response, next) {
        try {
            const {id, desc} = request.body;
            let post;
            if (request.files) {
                const {image} = request.files;
                let fileName = uuid.v4() + ".jpg";
                image.mv(path.resolve(__dirname, '..', 'static', fileName));
                post = await postService.updatePost(parseInt(id), desc, fileName);
            } else {
                post = await postService.updatePost(parseInt(id), desc, '');
            }
            return response.json(post);
        } catch (error) {
            next(error);
        }
    }

    async deletePost(request, response, next) {
        try {
            const {id} = request.body;
            const post = await postService.deletePost(parseInt(id));
            return response.json(post);
        } catch (error) {
            next(error);
        }
    }

    async check(request, response, next) {

        response.json({message: "Всё отлично"});
    }
};

module.exports = new PostController();