
export interface IMessage {
    id?: number;
    conversationId: number;
    userId: number;
    socketId?: string;
    text?: string;
    file?: File;
    isRead: boolean;
    date?: string;
}

// export interface MessagesState {
//     messages: IMessage[],
//     inputMessage: string
// }