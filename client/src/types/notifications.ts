export interface INotification {
    id?: number;
    userId: number;
    ref: string;
    type: string;
    isRead?: boolean;
    username?: string;
    userIdSender?: number;
    socketId?: string;
}