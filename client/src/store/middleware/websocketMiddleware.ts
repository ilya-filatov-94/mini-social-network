import {Middleware} from "@reduxjs/toolkit";
import {RootState} from "../index";
import {io, Socket} from "socket.io-client";
import {API_SocketURL} from '../../env_variables';
import axios from 'axios';

import {WebSocketState, typeConnect} from '../../types/websocket';
import {ClientToServerListen, ServerToClientListen} from './types';
import {changeInputMessage, initUser, IMessageList} from '../messagesSlice';
import {updateLastMessage} from '../conversationSlice';
import {IAttachFile} from '../../types/messenger';

let socket: Socket<ServerToClientListen, ClientToServerListen>
let initConnection = false;


export const webSocketMiddleware: Middleware = ({ dispatch, getState }) => (next) => async (action) => {
    const state = getState() as RootState;
    const webSocketState: WebSocketState = state.reducerWebsocket;
    const messagesState: IMessageList = state.reducerMessages;
    const userId = state.reducerAuth.currentUser.id;
    
    //Если соединение не создано, создаём и инициализируем события
    if (webSocketState.connect === typeConnect.Disconnected && !socket) {
        socket = io(API_SocketURL);
        socket.on('connect', () => {
            console.log("Вы успешно подключии сокет");
        });

        socket.on('connect_error', () => {
            console.log("Вы не подключены");
            socket.connect();
        });

        socket.on('message', (message) => {
            dispatch(updateLastMessage({text: message.text, file: message.file}));
            console.log('Сообщение от пользователя', message);
        });

    } else if (webSocketState.connect === typeConnect.Connected && socket) {
        //Если соединение создано, выполняем действия согласно заданным событиям  
        if (action.type === 'messages/send') {
            const fileData: IAttachFile = {};
            if (messagesState.inputMessage.file) {
                const response = await axios({
                    method: 'get',
                    url: messagesState.inputMessage.file,
                    responseType: 'blob'
                });
                fileData.body = response.data || '';
                fileData.mimeType = messagesState.inputMessage?.mimeTypeAttach || '';
            }

            const messageObj =  {...messagesState.inputMessage, socketId: socket.id, file: fileData.body};
            socket.emit('message', messageObj);
            const clearTextMessage = {...messagesState.inputMessage, text: '', file: '', mimeTypeAttach: ''};
            dispatch(changeInputMessage(clearTextMessage));
        }

        if (userId !== 0 && !initConnection) {
            initConnection = true;        
            dispatch(initUser(userId));
            socket.emit('addUser', userId);
        }
    }

    next(action);
}