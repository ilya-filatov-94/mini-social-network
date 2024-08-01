import { IMessage, IReadMsgs } from '../../types/messenger';
import { INotification } from '../../types/notifications';

export interface ServerToClientListen {
    message: (message: IMessage) => void;
    addUser: (userId: number) => void;
    msgIsDelivery: (message: Omit<IMessage, 
        "username" | "text" | "file" | "mimeTypeAttach" | "createdAt">
    ) => void;
    msgIsRead: (dataReadMsgs: IReadMsgs) => void;
    notification: (dataReadMsgs: INotification) => void;
}

export interface ClientToServerListen {
    message: (message: IMessage) => void;
    addUser: (userId: number) => void;
    read: (dataReadMsgs: IReadMsgs) => void;
    sendNotification: (dataNotification: INotification) => void;
}

