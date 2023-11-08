const CommentService = require('../service/comment-service');



class CommentController {
    async createComment(request, response, next) {
        try {
            const {id_user, id_com, desc} = request.body;
            const comment = await CommentService.createNewComment(parseInt(id_user), parseInt(id_com), desc);
            return response.json(comment);
        } catch (error) {
            next(error);
        }
    }

    async getAllComments(request, response, next) {
        try {
            let {id_user, id_com} = request.query;
            const comments = await CommentService.getAll(parseInt(id_user), parseInt(id_com));
            return response.json(comments);
        } catch (error) {
            next(error);
        }
    }

    async deleteComment(request, response, next) {
        try {
            const {id_user, id_com} = request.body;
            const comment = await CommentService.deleteComment(parseInt(id_user), parseInt(id_com));
            return response.json(comment);
        } catch (error) {
            next(error);
        }
    }
};

module.exports = new CommentController();