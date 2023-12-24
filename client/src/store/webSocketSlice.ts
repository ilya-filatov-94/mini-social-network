import { createSlice } from '@reduxjs/toolkit';
import { typeConnect } from '../types/websocket';
import { WebSocketState } from '../types/websocket';

const initialState : WebSocketState = {
    connect: typeConnect.Disconnected,
}

const WebSocketSlice = createSlice({
    name: 'webSocket',
    initialState,
    reducers: {
        wsConnect(state) {
            state.connect = typeConnect.Connected;
        },
        wsDisconnect(state) {
            state.connect = typeConnect.Disconnected;
        },
        send() {}
    }
});

export const {wsConnect, wsDisconnect, send} = WebSocketSlice.actions;
export default WebSocketSlice.reducer;
