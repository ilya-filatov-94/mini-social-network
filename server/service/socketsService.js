

class socketsService {
    constructor() { 
        this.onlineUsers = new Map();
    }

    addUser(userId, socketId) {
        let hasUser = this.onlineUsers.has(userId);
        if (!hasUser) {
            this.onlineUsers.set(userId, socketId);
            this.onlineUsers.set(socketId, userId);
        }
    }

    getUser(userId) {
        return this.onlineUsers.get(userId);
    }

    removeUser(socketId) {
        let userId = this.onlineUsers.get(socketId);
        this.onlineUsers.delete(socketId);
        this.onlineUsers.delete(userId);
    }
}


module.exports = new socketsService();