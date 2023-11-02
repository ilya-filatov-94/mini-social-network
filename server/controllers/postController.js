const postService = require('../service/post-service');




class PostController {

    async createPost(request, response, next) {
        try {
            const {idUser, desc, image} = request.body;
            const post = await postService.createNewPost(idUser, desc, image);
            return response.json(post);
        } catch (error) {
            next(error);
        }
    }
};

module.exports = new PostController();