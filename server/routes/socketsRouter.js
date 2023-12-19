const { Server } = require('socket.io');
const socketsController = require('../controllers/socketsController');


module.exports = function handlingSocketsEvents(server) {
    const socketIO = new Server(server, {
        cors: {
          origin: [process.env.CLIENT_URL],
          credentials: true
        },
    });

    socketIO.on("connection", (socket) => {
        console.log("user connected");

        socket.on('addUser', (userId) => {
            socketsController.addUser(userId, socket.id);
            socketIO.emit("getUsers", JSON.stringify(userId));
        });

        socket.on("sendMessage", ({ senderId, receiverId, text }) => {
            const socketId = getUser(receiverId);
            socketIO.to(socketId).emit("getMessage", {
              senderId,
              text,
            });
        });

        socket.on("disconnect", () => {
            console.log("user disconnected!");
            socketsController.removeUser(socket.id);
            socketIO.emit("getUsers", JSON.stringify(userId));
        });
    });
}