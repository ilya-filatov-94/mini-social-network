const CommentService = require('../service/comment-service');
const userService = require('../service/user-service');


class CommentController {
    async createComment(request, response, next) {
        try {
            const {userId, postId, desc} = request.body;
            const comment = await CommentService.createNewComment(parseInt(userId), parseInt(postId), desc);
            //Новая активность пользователя
            await createUserActivity(userId, desc, comment.dataValues.id);
            return response.json(comment);
        } catch (error) {
            next(error);
        }
    }

    async getAllComments(request, response, next) {
        try {
            const {id_post} = request.query;
            const comments = await CommentService.getAll(parseInt(id_post));
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

async function createUserActivity(userId, text, idActivity) {
    let id = parseInt(userId);
    let idAct = parseInt(idActivity);
    let typeNewActivity = 'addedComment';
    let descActivity = 'Добавил(а) комментарий';
    await userService.createActivity(id, typeNewActivity, descActivity, text, '', idAct);
}

module.exports = new CommentController();