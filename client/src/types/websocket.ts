
export enum typeConnect {
    Disconnected,
    Connected
}

export interface WebSocketState {
    connect: typeConnect
}