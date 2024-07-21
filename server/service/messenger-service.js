const {Conversation, Message, User} = require('../models/models');
const { Op } = require("sequelize");
const { changeKeyboardLayout } = require('../helpers/changeKeyboardLayout');

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

  async findMembers(userId, selector) {
    let members = [];
    if (selector) {
      const searchOtherKeys = changeKeyboardLayout(selector);
      members = await User.findAll({
          where: {
            [Op.and]: {
              username:  {[Op.or]: [{ [Op.iLike]: '%' + selector + '%' }, { [Op.iLike]: '%' + searchOtherKeys + '%' }]},
              id: { [Op.ne]: userId },
            },
          },
          attributes: ['id', 'username', 'refUser', 'profilePic', 'status'],
      });
    }
    return members;
  }

  async getConversations(curUserId) {
    let key1, key2;
    const conversations = await Conversation.findAll(
      {
        order: [['createdAt', 'DESC']],
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
    const usersObj = {};
    for (let i = 0; i < usersData.length; i++) {
      key1 = usersData[i].dataValues.id;
      usersObj[key1] = usersData[i].dataValues;
    }
    for (let i = 0; i < conversations.length; i++) {
      key1 = conversations[i].dataValues.participantId1;
      key2 = conversations[i].dataValues.participantId2;
      if (usersObj[key1]) {
        conversations[i].dataValues.memberId = usersObj[key1].id;
        conversations[i].dataValues.username = usersObj[key1].username;
        conversations[i].dataValues.profilePic = usersObj[key1].profilePic;
        conversations[i].dataValues.refUser = usersObj[key1].refUser;
        conversations[i].dataValues.status = usersObj[key1].status;
      }
      if (usersObj[key2]) {
        conversations[i].dataValues.memberId = usersObj[key2].id;
        conversations[i].dataValues.username = usersObj[key2].username;
        conversations[i].dataValues.profilePic = usersObj[key2].profilePic;
        conversations[i].dataValues.refUser = usersObj[key2].refUser;
        conversations[i].dataValues.status = usersObj[key2].status;
      }
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

  async getUnreadMessages(curUserId) {
    const conversations = await Conversation.findAll(
      {
        order: [['createdAt', 'DESC']],
        where: {[Op.or]: [{participantId1: curUserId}, {participantId2: curUserId}]},
        attributes: ['id'],
      },
    );
    const conversationIds = conversations.map(({dataValues}) => dataValues.id);
    const unReadMessages = await Message.findAll(
      {
        where: { 
          conversationId: conversationIds,
          userId: { [Op.ne]: curUserId },
          isRead: false,
        },
        order: [['createdAt', 'DESC']],
        attributes: ['conversationId', 'isRead', 'userId'],
      },
    );
    //Количество непрочитанных сообщений в каждом диалоге у собеседника
    const objUnreadInEveryConv = {};
    unReadMessages.forEach(({conversationId, isRead, userId}) => {
      if (!isRead && userId !== curUserId) {
        objUnreadInEveryConv[conversationId] == undefined ? objUnreadInEveryConv[conversationId] = 1 : ++objUnreadInEveryConv[conversationId];
      }
    });
    return objUnreadInEveryConv;
  }

}


module.exports = new MessengerService();