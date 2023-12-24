const { Server } = require('socket.io');
const socketsService = require('../service/socketsService');

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
            // console.log('Подключил пользователя', userId);
            // console.log('Текущее соединение сокета', sessionId);
            socketsService.addUser(userId, sessionId);

            const socketId = socketsService.getUser(userId);
            console.log('Айди сессси по Id user', socketId);
            // socketIO.emit("getUsers", socket);
        });

        socket.on("message", (socket) => {
            console.log(socket);
            // const socketId = socketsService.getUser(socket.socketId);
            // console.log(socketId);
            // socketIO.to(socketId).emit("message", socket);
        });

        socket.on("disconnect", () => {
            console.log("user disconnected!");
            socketsService.removeUser(socket.id);
            // socketIO.emit("getUsers", JSON.stringify(userId));
        });
    });
}