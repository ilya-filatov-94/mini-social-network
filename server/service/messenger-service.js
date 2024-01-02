const {Conversation, Message, User} = require('../models/models');
const { Op } = require("sequelize");


class MessengerService {
  
  async openConversation(curUserId, memberId) {
    let conversation = await Conversation.findOne(
      {
        where: {[Op.or]: [
        {
          participantId1: curUserId, 
          participantId2: memberId
        }, 
        { participantId1: memberId,
          participantId2: curUserId
        }]},
      },
    );
    console.log('Данные уже существующего диалога');
    if (!conversation) {
      conversation = await Conversation.create({
        participantId1: curUserId,
        participantId2: memberId,
        lastMessageText: '',
        lastMessageId: 1,
        counterUnreadMessages: 0
      });
      console.log('Данные Только что созданного диалога');
    }
    const usersData = await User.findOne({
      where: { id: memberId},
      attributes: ['id', 'username', 'refUser', 'profilePic', 'status']
    });
    conversation.dataValues.memberId = usersData.dataValues.id;
    conversation.dataValues.username = usersData.dataValues.username;
    conversation.dataValues.profilePic = usersData.dataValues.profilePic;
    conversation.dataValues.refUser = usersData.dataValues.refUser;
    conversation.dataValues.status = usersData.dataValues.status;
    return conversation || {};
  }

  async findMembers(id, selector) {
    let members = [];
    if (selector) {
      members = await User.findAll({
          where: {
            [Op.and]: {
              username: { [Op.iLike]: '%' + selector + '%' },
              id: { [Op.ne]: id },
            },
          },
          attributes: ['id', 'username', 'refUser', 'profilePic', 'status'],
      });
    }
    return members;
  }

  async getConversations(curUserId) {
    const conversations = await Conversation.findAll(
        {
          where: {[Op.or]: [{participantId1: curUserId}, {participantId2: curUserId}]},
        },
    );
    const idUsers = [];
    for (let i = 0; i < conversations.length; i++) {
      let id1 = conversations[i].dataValues.participantId1;
      let id2 = conversations[i].dataValues.participantId2;
      let userId = (id1 === curUserId ? id2 : id1);
      idUsers.push(userId);
    }
    const usersData = await User.findAll({
      where: { id: idUsers},
      attributes: ['id', 'username', 'refUser', 'profilePic', 'status']
    });
    for (let i = 0; i < conversations.length; i++) {
      conversations[i].dataValues.memberId = usersData[i].dataValues.id;
      conversations[i].dataValues.username = usersData[i].dataValues.username;
      conversations[i].dataValues.profilePic = usersData[i].dataValues.profilePic;
      conversations[i].dataValues.refUser = usersData[i].dataValues.refUser;
      conversations[i].dataValues.status = usersData[i].dataValues.status;
    }
    return conversations;
  }

  async getMessages(conversationId) {
    const messages = await Message.findAll(
        {
          where: { conversationId: conversationId },
          order: [['createdAt', 'ASC']],
        },
    );
    return messages;
  }

}


module.exports = new MessengerService();