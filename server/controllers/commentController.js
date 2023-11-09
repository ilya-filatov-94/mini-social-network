const CommentService = require('../service/comment-service');



class CommentController {
    async createComment(request, response, next) {
        try {
            const {userId, postId, desc} = request.body;
            const comment = await CommentService.createNewComment(parseInt(userId), parseInt(postId), desc);
            return response.json(comment);
        } catch (error) {
            next(error);
        }
    }

    async getAllComments(request, response, next) {
        try {
            const {id_user, id_post} = request.query;
            const comments = await CommentService.getAll(parseInt(id_user), parseInt(id_post));
            return response.json(comments);
        } catch (error) {
            next(error);
        }
    }

    async deleteComment(request, response, next) {
        try {
            const {postId, comId} = request.body;
            const comment = await CommentService.deleteComment(parseInt(postId), parseInt(comId));
            return response.json(comment);
        } catch (error) {
            next(error);
        }
    }
};

module.exports = new CommentController();