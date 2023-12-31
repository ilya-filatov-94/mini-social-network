

class socketsService {
    constructor() { 
        this.sessionId = '';
        this.onlineUsers = new Map();
        this.lastMessage = {
            id: 0,
            conversationId: 0,
            userId: 0,
            username: '',
            text: '',
            isRead: false,
            createdAt: '',
        }
    }

    updateSessionId(id) {
        this.sessionId = id;
    }

    getCurSessionId() {
        return this.sessionId;
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

    updateLastMessage(data) {
        this.lastMessage.id = data.dataValues.id;
        this.lastMessage.conversationId = data.dataValues.conversationId;
        this.lastMessage.userId = data.dataValues.userId;
        this.lastMessage.username = data.dataValues.username;
        this.lastMessage.text = data.dataValues.text;
        this.lastMessage.isRead = data.dataValues.isRead;
        this.lastMessage.createdAt = data.dataValues.createdAt;

        // this.lastMessage.createdAt = new Date(data.dataValues.createdAt);
        // this.lastMessage.createdAt = new Date(Date.parse(data.dataValues.createdAt));
    }

    getLastMessage() {
        return this.lastMessage;
    }
}


module.exports = new socketsService();