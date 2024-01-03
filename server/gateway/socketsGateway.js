const socketsService = require('../service/socketsService');
const {User, Conversation, Message} = require('../models/models');
const fs = require('fs');
const uuid = require('uuid');


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
            const idSocketSender = socketsService.getUser(message.userId); //По userId получателя достаём его socketId
            const userIdSender = socketsService.getUser(message.socketId);  //по socketId отправителя достаём его userId
            
            console.log(message.socketId, 'От кого сообщение', userIdSender);
            console.log(idSocketSender, 'Для кого сообщение', message.userId);

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
            if (idSocketSender) {
                socketIO.to(idSocketSender).emit("message", {
                    id: lastMessage.id,
                    conversationId: lastMessage.conversationId,
                    userId: lastMessage.userId,
                    username: lastMessage.username,
                    text: lastMessage.text,
                    file: lastMessage.file || '',
                    isRead: lastMessage.isRead,
                    createdAt: String(lastMessage.createdAt),
                    socketId: idSocketSender
                });
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
                    console.log("user disconnected!", userId);
                });
            }
        });
    });
}