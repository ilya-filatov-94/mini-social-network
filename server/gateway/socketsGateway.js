const socketsService = require('../service/socketsService');
const {User, Conversation, Message} = require('../models/models');
const uuid = require('uuid');
const path = require('path');


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

        socket.on("message", (message) => {
            console.log(message);

            if (!message.userId || !message.socketId) return;
            const idSocketSender = socketsService.getUser(message.userId); //По userId получателя достаём его socketId
            const userIdSender = socketsService.getUser(message.socketId);  //по socketId отправителя достаём его userId
            
            if (!idSocketSender || !userIdSender) return;
            
            console.log(message.socketId, 'От кого сообщение', userIdSender);
            console.log(idSocketSender, 'Для кого сообщение', message.userId);

            let fileName, typeImage;
            if (message.file) {
                console.log('файл прикреплённый', message.file);
                // typeImage = message.file.mimetype.replace('image/', '');
                // fileName = uuid.v4() + '.' + typeImage;
                // image.mv(path.resolve(__dirname, '..', 'static', fileName));
            }

            Message.create({
                text: message.text,
                file: '',
                isRead: false,
                userId: Number(userIdSender),
                conversationId: Number(message.conversationId),
                username: message.username,
            })
            .then((result) => {
                socketsService.updateLastMessage(result);
                
                Conversation.update({ 
                    lastMessageId: result.dataValues.id,
                    lastMessageText: result.dataValues.text
                }, {where: {id: Number(result.dataValues.conversationId)}})
                .then(result => {
                    const lastMessage = socketsService.getLastMessage();
                    if (idSocketSender) {
                        socketIO.to(idSocketSender).emit("message", {
                            id: lastMessage.id,
                            conversationId: lastMessage.conversationId,
                            userId: lastMessage.userId,
                            username: lastMessage.username,
                            text: lastMessage.text,
                            isRead: lastMessage.isRead,
                            createdAt: String(lastMessage.createdAt),
                            socketId: idSocketSender
                        });
                    }
                });
            });
        });

        socket.on("disconnect", () => {
            const userId = socketsService.getUser(socket.id);
            if (userId) {
                User.update({ 
                    status: "offline"
                }, {where: {id: userId}})
                .then(result => {
                    console.log(result);
                    socketsService.removeUser(userId);
                    console.log('Отключил пользователя по id: ', userId);
                    console.log("user disconnected!", userId);
                });
            }
        });
    });
}