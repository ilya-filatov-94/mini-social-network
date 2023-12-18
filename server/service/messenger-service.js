const {Conversation, Message} = require('../models/models');
const { Op } = require("sequelize");


class MessengerService {
  async createConversation(curUserId, memberId) {
    const conversation = await Conversation.create({
      participantId1: curUserId,
      participantId2: memberId,
      lastMessageId: 0,
      lastMessageText: '',
      counterUnreadMessages: 0,
    });
    return conversation;
  }

  async getConversations(curUserId) {
    const conversations = await Conversation.findAll(
        {
            where: {[Op.or]: [{participantId1: curUserId}, {participantId2: curUserId}]},
        },
    );
    return conversations;
  }

  async getMessages(conversationId) {
    const messages = await Message.findAll(
        {
            where: { conversationId: conversationId },
        },
    );
    return messages;
  }

}


module.exports = new MessengerService();