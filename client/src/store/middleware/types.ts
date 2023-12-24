import { IMessage } from '../../types/messenger';

export interface ServerToClientListen {
    message: (message: IMessage) => void;
    addUser: (userId: number) => void;
}

export interface ClientToServerListen {
    message: (message: IMessage) => void;
    addUser: (userId: number) => void;
}
