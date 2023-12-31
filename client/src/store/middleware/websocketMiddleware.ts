import {Middleware} from "@reduxjs/toolkit";
import {RootState} from "../index";
import {io, Socket} from "socket.io-client";
import {API_SocketURL} from '../../env_variables';
import axios from 'axios';

import {WebSocketState} from '../../types/websocket';
import {typeConnect} from '../../types/websocket';
import {ClientToServerListen, ServerToClientListen} from './types';
import {IMessageList} from '../messagesSlice';
import {addMessage, changeInputMessage, initUser} from '../messagesSlice';


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
            // dispatch(addMessage({message: messagesState.inputMessage}));
            console.log('Сообщение от пользователя', message);
        });

    } else if (webSocketState.connect === typeConnect.Connected && socket) {
        //Если соединение создано, выполняем действия согласно заданным событиям  
        if (action.type === 'messages/send') {
            let fileData;
            if (messagesState.inputMessage.file) {
                const response = await axios({
                    method: 'get',
                    url: messagesState.inputMessage.file,
                    responseType: 'blob'
                });
                fileData = response.data || '';
            }
            const messageObj =  {...messagesState.inputMessage, socketId: socket.id, file: fileData};
            socket.emit('message', messageObj);
            const clearTextMessage = {...messagesState.inputMessage, text: '', file: ''};
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