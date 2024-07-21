import {Middleware} from "@reduxjs/toolkit";
import {RootState} from "../index";
import {io, Socket} from "socket.io-client";
import {API_SocketURL} from '../../env_variables';
import axios from 'axios';

import {WebSocketState, typeConnect} from '../../types/websocket';
import {ClientToServerListen, ServerToClientListen} from './types';
import {
    changeInputMessage, 
    initUser, 
    IMessageList, 
    updateUnreadMsgsList, 
    updateReadStatusFromServer
} from '../messagesSlice';
import {updateLastMessage} from '../conversationSlice';
import {IAttachFile, IReadMsgs} from '../../types/messenger';

let socket: Socket<ServerToClientListen, ClientToServerListen>
let initConnection = false;


export const webSocketMiddleware: Middleware = ({ dispatch, getState }) => (next) => async (action) => {
    const state = getState() as RootState;
    const webSocketState: WebSocketState = state.reducerWebsocket;
    const messagesState: IMessageList = state.reducerMessages;
    const userId = state.reducerAuth.currentUser.id;
    
    if (webSocketState.connect === typeConnect.Disconnected && !socket) {   //Создание соединения и инициализация событий
        socket = io(API_SocketURL);
        socket.on('connect', () => {
            console.log("Вы успешно подключии сокет");
        });

        socket.on('connect_error', (err) => {
            console.log("Ошибка websocket", err.message);
            socket.connect();
        });

        socket.on('message', (message) => {
            const numberUnreadMsgs = getState()?.reducerMessages?.unreadMsgsList[message.conversationId] || 0;
            dispatch(updateUnreadMsgsList({[message.conversationId]: numberUnreadMsgs+1}));
            dispatch(updateLastMessage(message));
        });

        socket.on('msgIsDelivery', (message) => {
            dispatch(updateLastMessage(message));
        });

        socket.on('msgIsRead', (dataMsgs) => {
            dispatch(updateReadStatusFromServer(dataMsgs));
        });

    } else if (webSocketState.connect === typeConnect.Connected && socket) { 
        if (action.type === 'messages/send') {
            const fileData: IAttachFile = {};
            if (messagesState.inputMessage.file) {
                const response = await axios({
                    method: 'get',
                    url: messagesState.inputMessage.file,
                    responseType: 'blob'
                });
                fileData.body = response.data || '';
            }
            const messageObj =  {...messagesState.inputMessage, socketId: socket.id, file: fileData.body};
            socket.emit('message', messageObj);
            const clearTextMessage = {...messagesState.inputMessage, text: '', file: '', mimeTypeAttach: ''};
            dispatch(changeInputMessage(clearTextMessage));
        }

        if (action.type === 'messages/changeMsgsReadStatus') {
            const dataReadMsgs: IReadMsgs = {
                ...action.payload as IReadMsgs,
                socketId: socket.id,
            }
            socket.emit('read', dataReadMsgs);
        }

        if (userId !== 0 && !initConnection) {
            initConnection = true;        
            dispatch(initUser(userId));
            socket.emit('addUser', userId);
        }
    }

    next(action);
}