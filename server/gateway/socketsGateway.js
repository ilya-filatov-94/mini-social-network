const socketsService = require('../service/socketsService');
const {User, Conversation, Message} = require('../models/models');
const uuid = require('uuid');
const path = require('path');

let sessionId = '';
let lastMessage = {
    id: 0,
    conversationId: 0,
    userId: 0,
    username: '',
    text: '',
    isRead: false,
    createdAt: '',
}

module.exports = function handlingSocketsEvents(socketIO) {

    socketIO.on("connection", (socket) => {
        console.log("user connected", socket.id);
        sessionId = socket.id;

        socket.on('addUser', (userId) => {
            socketsService.addUser(userId, sessionId);
            const socketId = socketsService.getUser(userId);

            User.update({ 
                status: "online"
            }, {where: {id: Number(userId)}})
            .then(result => {
                console.log(result);
                console.log('Подключил пользователя', userId);
                console.log('Айди сессси по Id user', socketId);
            });
        });

        socket.on("message", (message) => {
            console.log(message);
            const idSocketSender = socketsService.getUser(message.userId); //По userId получателя достаём его socketId
            const userIdSender = socketsService.getUser(message.socketId);  //по socketId отправителя достаём его userId
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
                lastMessage.id = result.dataValues.id;
                lastMessage.conversationId = result.dataValues.conversationId;
                lastMessage.userId = result.dataValues.userId;
                lastMessage.username = result.dataValues.username;
                lastMessage.text = result.dataValues.text;
                lastMessage.isRead = result.dataValues.isRead;
                lastMessage.createdAt = new Date(result.dataValues.createdAt);
                
                Conversation.update({ 
                    lastMessageId: result.dataValues.id,
                    lastMessageText: result.dataValues.text
                }, {where: {id: Number(result.dataValues.conversationId)}})
                .then(result => {
                    socketIO.to(idSocketSender).emit("message", {
                        id: lastMessage.id,
                        conversationId: lastMessage.conversationId,
                        userId: lastMessage.userId,
                        username: lastMessage.username,
                        text: lastMessage.text,
                        isRead: lastMessage.isRead,
                        createdAt: String(lastMessage.createdAt),
                    });
                });
            });
        });

        socket.on("disconnect", () => {
            const userId = socketsService.getUser(socket.id);

            User.update({ 
                status: "offline"
            }, {where: {id: userId}})
            .then(result => {
                console.log(result);
                socketsService.removeUser(userId);
                console.log('Отключил пользователя по id: ', userId);
                console.log("user disconnected!", userId);
            });
        });
    });
}