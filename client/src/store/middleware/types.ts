import { IMessage, IReadMsgs } from '../../types/messenger';

export interface ServerToClientListen {
    message: (message: IMessage) => void;
    addUser: (userId: number) => void;
    msgIsDelivery: (message: Omit<IMessage, 
        "username" | "text" | "file" | "mimeTypeAttach" | "createdAt">
    ) => void;
    msgIsRead: (dataReadMsgs: IReadMsgs) => void;
}

export interface ClientToServerListen {
    message: (message: IMessage) => void;
    addUser: (userId: number) => void;
    read: (dataReadMsgs: IReadMsgs) => void;
}

