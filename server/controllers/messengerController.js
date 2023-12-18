const messengerService = require('../service/messenger-service');
const uuid = require('uuid');
const path = require('path');



class messengerController {
    async createConversation(request, response, next) {
        try {
            const {curUserId, memberId} = request.body;
            const conversation = await messengerService.createConversation(curUserId, memberId);
            return response.json(conversation);
        } catch(error) {
            next(error);
        }
    }

    async getConversations(request, response, next) {
        try {
            const {curUserId} = request.query;
            const conversations = await messengerService.getConversations(curUserId);
            return response.json(conversations);
        } catch(error) {
            next(error);
        }
    }

    async getMessages(request, response, next) {
        try {
            const {conversationId} = request.query;
            const messages = await messengerService.getMessages(conversationId);
            return response.json(messages);
        } catch(error) {
            next(error);
        }
    }
}

module.exports = new messengerController();