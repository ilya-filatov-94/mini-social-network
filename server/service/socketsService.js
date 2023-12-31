

class socketsService {
    constructor() { 
        this.onlineUsers = new Map();
    }

    addUser(userId, socketId) {
        let hasUser = this.onlineUsers.has(String(userId));
        if (!hasUser) {
            this.onlineUsers.set(String(userId), socketId);
            this.onlineUsers.set(socketId, String(userId));
        }
    }

    getUser(userId) {
        return this.onlineUsers.get(String(userId));
    }

    removeUser(socketId) {
        let userId = this.onlineUsers.get(socketId);
        this.onlineUsers.delete(socketId);
        this.onlineUsers.delete(String(userId));
    }
}


module.exports = new socketsService();