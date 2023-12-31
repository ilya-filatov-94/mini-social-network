import { IMessage } from '../types/messenger';
import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export interface IMessageList {
    messages: IMessage[];
    inputMessage: IMessage;
}

const initialState : IMessageList = {
    messages: [],
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
        addMessage(state, action: PayloadAction<{message: IMessage}>) {
            state.messages.push(action.payload.message)
        },
        changeInputMessage(state, action: PayloadAction<IMessage>) {
            state.inputMessage = action.payload;
        },
        send() {}
    }
});

export const {
    addMessage, 
    changeInputMessage, 
    initUser,
    send
} = MessagesSlice.actions;
export default MessagesSlice.reducer;