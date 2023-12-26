const messengerService = require('../service/messenger-service');
const uuid = require('uuid');
const path = require('path');


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
            const {id} = request.query;
            const conversations = await messengerService.getConversations(Number(id));
            return response.json(conversations);
        } catch(error) {
            next(error);
        }
    }

    async findMembers(request, response, next) {
        try {
            const {id, selector} = request.query;
            const members = await messengerService.findMembers(Number(id), selector);
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
}

module.exports = new messengerController();