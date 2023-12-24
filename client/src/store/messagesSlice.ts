import { IMessage } from '../types/messenger';
import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export interface IMessageList {
    messages: IMessage[];
    inputMessage: IMessage;
}

const initialState : IMessageList = {
    messages: [],
    inputMessage: {
        conversationId: 1,
        userId: 1,
        isRead: false,
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
    }
});

export const {addMessage, changeInputMessage, initUser} = MessagesSlice.actions;
export default MessagesSlice.reducer;