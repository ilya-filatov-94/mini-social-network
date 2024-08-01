const messengerService = require('../service/messenger-service');


class messengerController {
    async openConversation(request, response, next) {
        try {
            const {curUserId, memberId} = request.body;
            const conversation = await messengerService.openConversation(Number(curUserId), Number(memberId));
            return response.json(conversation);
        } catch(error) {
            next(error);
        }
    }

    async getConversations(request, response, next) {
        try {
            const {userId} = request.query;
            const conversations = await messengerService.getConversations(Number(userId));
            return response.json(conversations);
        } catch(error) {
            next(error);
        }
    }

    async findMembers(request, response, next) {
        try {
            const {userId, selector} = request.query;
            const members = await messengerService.findMembers(Number(userId), selector);
            return response.json(members);
        } catch (error) {
            next(error);
        }
    }

    async getMessages(request, response, next) {
        try {
            const {conversationId} = request.query;
            const messages = await messengerService.getMessages(Number(conversationId));
            return response.json(messages);
        } catch(error) {
            next(error);
        }
    }

    async sendMessage(request, response, next) {
        try {
            const {conversationId} = request.body;
            const messages = await messengerService.getMessages(Number(conversationId));
            return response.json(messages);
        } catch(error) {
            next(error);
        }
    }

    async getUnreadMessages(request, response, next) {
        try {
            const {userId} = request.query;
            const messages = await messengerService.getUnreadMessages(Number(userId));
            return response.json(messages);
        } catch(error) {
            next(error);
        }
    }

}

module.exports = new messengerController();