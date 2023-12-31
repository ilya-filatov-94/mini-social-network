import { createSlice } from '@reduxjs/toolkit';
import { typeConnect, WebSocketState } from '../types/websocket';


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
    }
});

export const {wsConnect, wsDisconnect} = WebSocketSlice.actions;
export default WebSocketSlice.reducer;
