const postService = require('../service/post-service');
const uuid = require('uuid');
const path = require('path');




class PostController {

    async createPost(request, response, next) {
        try {
            const {id, desc} = request.body;
            let post, typeImage, fileName;
            if (request.files) {
                const {image} = request.files;
                typeImage = image.mimetype.replace('image/', '');
                fileName = uuid.v4() + '.' + typeImage;
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
            const {id} = request.query;
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
            let post, typeImage, fileName;
            if (request.files) {
                const {image} = request.files;
                typeImage = image.mimetype.replace('image/', '');
                fileName = uuid.v4() + '.' + typeImage;
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

    async addLike(request, response, next) {
        try {
            const {userId, postId} = request.body;
            const like = await postService.addLike(parseInt(userId), parseInt(postId));
            return response.json(like);
        } catch (error) {
            next(error);
        }
    }

    async removeLike(request, response, next) {
        try {
            const {userId, postId} = request.body;
            const like = await postService.removeLike(parseInt(userId), parseInt(postId));
            return response.json(like);
        } catch (error) {
            next(error);
        }
    }

    async getLikes(request, response, next) {
        try {
            const {post_id} = request.query;
            const likes = await postService.getLikes(parseInt(post_id));
            return response.json(likes);
        } catch (error) {
            next(error);
        }
    }


};

module.exports = new PostController();