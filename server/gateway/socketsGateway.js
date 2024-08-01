const socketsService = require('../service/socketsService');
const {User, Conversation, Message} = require('../models/models');
const fs = require('fs');
const uuid = require('uuid');
const notificationService = require('../service/notification-service');

module.exports = function handlingSocketsEvents(socketIO) {

    socketIO.on("connection", (socket) => {
        console.log("user connected", socket.id);
        socketsService.updateSessionId(socket.id);

        socket.on('addUser', (userId) => {
            if (userId) {
                const sessionId = socketsService.getCurSessionId();
                socketsService.addUser(userId, sessionId);
                const socketId = socketsService.getUser(userId);

                User.update({ 
                    status: "online"
                }, {where: {id: Number(userId)}})
                .then(result => {
                    console.log('Подключил пользователя', userId);
                    console.log('Айди сессси по Id user', socketId);
                });
            }
        });

        socket.on("message", async (message) => {
            console.log(message);

            if (!message.userId || !message.socketId) return;
            const socketIdSender = socketsService.getUser(message.userId); //По userId получателя достаём его socketId
            const userIdSender = socketsService.getUser(message.socketId);  //по socketId отправителя достаём его userId
            
            console.log(message.socketId, 'От кого сообщение', userIdSender);
            console.log(socketIdSender, 'Для кого сообщение', message.userId);

            if (!userIdSender) return;

            let fileName, typeFile;
            if (message?.file) {
                typeFile = message.mimeTypeAttach.replace('image/', '');
                fileName = uuid.v4() + '.' + typeFile;
                await fs.promises.writeFile('./static/' + fileName, message.file);
            }

            const newMessage = await Message.create({
                text: message.text,
                file: fileName || '',
                isRead: false,
                isDelivery: true,
                userId: Number(userIdSender),
                conversationId: Number(message.conversationId),
                username: message.username,
            });

            socketsService.updateLastMessage(newMessage);
            await Conversation.update({ 
                lastMessageId: newMessage.dataValues.id,
                lastMessageText: newMessage.dataValues.text || 'картинка'
            }, {where: {id: Number(newMessage.dataValues.conversationId)}});

            const lastMessage = socketsService.getLastMessage();
            if (socketIdSender) {
                socketIO.to(socketIdSender).emit("message", {
                    id: lastMessage.id,
                    conversationId: lastMessage.conversationId,
                    userId: lastMessage.userId,
                    username: lastMessage.username,
                    text: lastMessage.text,
                    file: lastMessage.file || '',
                    isRead: lastMessage.isRead,
                    createdAt: String(lastMessage.createdAt),
                    socketId: socketIdSender
                });
                socketIO.to(message.socketId).emit("msgIsDelivery", {
                    id: lastMessage.id,
                    conversationId: lastMessage.conversationId,
                    userId: lastMessage.userId,
                    text: lastMessage.text,
                    file: lastMessage.file || '',
                    isDelivery: lastMessage.isDelivery,
                    createdAt: String(lastMessage.createdAt),
                    isRead: false
                });
            }
        });

        socket.on("read", async (dataReadMessages) => {
            console.log(dataReadMessages);

            if (!dataReadMessages.userId || !dataReadMessages.socketId) return;
            const socketIdSender = socketsService.getUser(dataReadMessages.userId); //По userId получателя достаём его socketId
            const userIdSender = socketsService.getUser(dataReadMessages.socketId);  //по socketId отправителя достаём его userId
            
            console.log(dataReadMessages.socketId, 'От кого', userIdSender);
            console.log(socketIdSender, 'Для кого', dataReadMessages.userId);

            if (!userIdSender) return;
            await Message.update({ isRead: true }, {
                where: {
                    id: dataReadMessages.ids,
                },
            });
            if (socketIdSender) {
                socketIO.to(socketIdSender).emit("msgIsRead", {
                    ...dataReadMessages
                });
            }
        });

        socket.on("sendNotification", async (dataNotification) => {
            console.log(dataNotification);

            if (!dataNotification.userId || !dataNotification.socketId) return;
            const socketIdSender = socketsService.getUser(dataNotification.userId); //По userId получателя достаём его socketId
            const userIdSender = socketsService.getUser(dataNotification.socketId);  //по socketId отправителя достаём его userId
            
            console.log(dataNotification.socketId, 'От кого', userIdSender);
            console.log(socketIdSender, 'Для кого', dataNotification.userId);

            if (!userIdSender) return;

            let notification;
            const deletedNotification = socketsService.deleteNotifications[dataNotification.type];
            if (deletedNotification) {
                try {
                    await notificationService.deleteNotification(deletedNotification, dataNotification.ref);
                } catch (error) {
                    console.log(error);
                }
                notification = {};
            }
            if (dataNotification.type === 'deletedPost') {
                try {
                    await notificationService.deleteAllNotificationOfPost(dataNotification.ref);
                } catch (error) {
                    console.log(error);
                }
                notification = {};
            }
            if (!deletedNotification) {
                try {
                    notification = await notificationService.createNotification(
                        Number(dataNotification.userId), 
                        Number(userIdSender), 
                        dataNotification.ref, 
                        dataNotification.type
                    );
                } catch (error) {
                    console.log(error);
                    notification = {};
                }
            }

            const permissionToSend = socketIdSender && Object.keys(notification)?.length && dataNotification.type !== "deleteLike";
            if (permissionToSend) {
                socketIO.to(socketIdSender).emit("notification", notification);
            }
        });

        socket.on("disconnect", () => {
            const userId = socketsService.getUser(socket.id);
            if (userId) {
                User.update({ 
                    status: "offline"
                }, {where: {id: userId}})
                .then(result => {
                    socketsService.removeUser(userId);
                    console.log(`user ${userId} disconnected!`, result);
                });
            }
        });
    });
}
