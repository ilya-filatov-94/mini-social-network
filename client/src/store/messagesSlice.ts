import { IMessage } from '../types/messenger';
import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export interface IMessageList {
    inputMessage: IMessage;
}

const initialState : IMessageList = {
    inputMessage: {
        id: 0,
        conversationId: 0,
        userId: 0,
        username: '',
        isRead: false,
        createdAt: ''
    },
}

const MessagesSlice = createSlice({
    name: 'messages',
    initialState,
    reducers: {
        initUser(state, action: PayloadAction<number>) {
            state.inputMessage.userId = action.payload;
        },
        changeInputMessage(state, action: PayloadAction<IMessage>) {
            state.inputMessage = action.payload;
        },
        send() {}
    }
});

export const {
    changeInputMessage, 
    initUser,
    send
} = MessagesSlice.actions;
export default MessagesSlice.reducer;