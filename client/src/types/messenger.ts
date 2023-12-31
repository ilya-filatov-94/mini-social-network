
export interface IConversation {
    id: number;
    memberId: number;
    lastMessageId?: number;
    lastMessageText?: string;
    username: string;
    profilePic: string | undefined;
    refUser: string;
    status?: string;
    addClass?: string;
}

export interface IPossibleConversation {
    id?: number;
    userId: number;
    username: string;
    profilePic: string | undefined;
    refUser: string;
    status?: string;
    addClass?: string;
}

export interface IMessage {
    id?: number;
    conversationId: number;
    userId: number;
    username?: string;
    text?: string;
    file?: string;
    isRead: boolean;
    createdAt?: string;
    socketId?: string;
}

