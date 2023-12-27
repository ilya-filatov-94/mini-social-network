const { Server } = require('socket.io');
const socketsService = require('../service/socketsService');
const {User} = require('../models/models');

let sessionId = '';

module.exports = function handlingSocketsEvents(server) {
    const socketIO = new Server(server, {
        cors: {
          origin: [process.env.CLIENT_URL],
          credentials: true
        },
    });

    socketIO.on("connection", (socket) => {
        console.log("user connected", socket.id);
        sessionId = socket.id;

        socket.on('addUser', (userId) => {
            socketsService.addUser(userId, sessionId);
            const socketId = socketsService.getUser(userId);

            User.update({ 
                status: "online"
            }, {where: {id: Number(userId)}});

            console.log('Подключил пользователя', userId);
            console.log('Айди сессси по Id user', socketId);
        });

        socket.on("message", (socket) => {
            console.log(socket);
            // const socketId = socketsService.getUser(socket.socketId);
            // console.log(socketId);
            // socketIO.to(socketId).emit("message", socket);
        });

        socket.on("disconnect", () => {
            const userId = socketsService.getUser(socket.id);

            User.update({ 
                status: "offline"
            }, {where: {id: userId}});
            socketsService.removeUser(userId);

            console.log('Отключил пользователя по id: ', userId);
            console.log("user disconnected!", userId);

        });
    });
}