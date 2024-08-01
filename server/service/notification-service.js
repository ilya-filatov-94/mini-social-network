const {Notification, User, Comment} = require('../models/models');
const { Op } = require("sequelize");

class NotificationService {
  async createNotification(userId, senderId, ref, type) {
    if (!userId || !senderId || !ref || !type) return {};
    const notification = await Notification.create({
      userId,
      senderId,
      ref,
      type,
      isRead: false
    });
    const user = await User.findOne({
        where: {id: senderId},
        attributes: ['username']
    });
    return {...notification.dataValues, ...user.dataValues};
  }

  async updateNotification(userId) {
    if (!userId) return;
      return await Notification.update({ 
        isRead: true,  
      }, {where: {
        userId,
      }
      });
  }

  async deleteNotification(type, ref) {
    if (!type || !ref) return;
    return await Notification.destroy({
        where: {
            ref,
            type,
        },
    });
  }

  async deleteAllNotificationOfPost(ref) {
    if (!ref) return;
    const postId = Number(ref.replace('/post/', ''));
    const commentIds = await Comment.findAll({
      where: { postId: postId },
      order: [['createdAt', 'DESC']],
      attributes: [
        "id"
      ]
    });
    let refs = [];
    if (commentIds?.length) {
      refs = commentIds?.map(item => '/comment/' + item);
    }
    refs.push(ref);
    return await Notification.destroy({
        where: {
          ref: refs
        },
    });
  }

  async getAll(userId) {
    if (!userId) return [];
    const notifications = await Notification.findAll({
      where: {
        userId: userId,
      },
      order: [['createdAt', 'DESC']],
      attributes: [
        "id",
        "userId",
        "senderId",
        "ref",
        "type",
        "isRead",
        "createdAt"
      ],
      include: [{
        model: User,
        where: {id: {[Op.col]: 'notification.senderId'}},
        attributes: ["username"]
      }],
    });
    if (!notifications?.length) return [];
    const flatNotifications = notifications.map(notification => (
      {
        id: notification.id,
        userId: notification.userId,
        senderId: notification.senderId,
        ref: notification.ref,
        type: notification.type,
        isRead: notification.isRead,
        createdAt: notification.createdAt,
        username: notification.user.username,
      }
    ));
    return flatNotifications;
  }

}

module.exports = new NotificationService();