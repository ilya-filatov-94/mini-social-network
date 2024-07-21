const postService = require('../service/post-service');
const uuid = require('uuid');
const path = require('path');
const userService = require('../service/user-service');


class PostController {

    async createPost(request, response, next) {
        try {
            const {id, desc} = request.body;
            let typeImage;
            let fileName = '';
            if (request.files) {
                const {image} = request.files;
                typeImage = image.mimetype.replace('image/', '');
                fileName = uuid.v4() + '.' + typeImage;
                image.mv(path.resolve(__dirname, '..', 'static', fileName));
            }
            const post = await postService.createNewPost(parseInt(id), desc, fileName);
            await createUserActivity(post.dataValues.userId, desc, fileName, post.dataValues.id);
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
            const {postId} = request.query;
            const likes = await postService.getLikes(parseInt(postId));
            return response.json(likes);
        } catch (error) {
            next(error);
        }
    }


};

async function createUserActivity(userId, text, image, idActivity) {
    let id = parseInt(userId);
    let idAct = parseInt(idActivity);
    let typeNewActivity = 'addedPost';
    let descActivity = 'Опубликовал(а) новый пост';
    await userService.createActivity(id, typeNewActivity, descActivity, text, image, idAct);
}

module.exports = new PostController();