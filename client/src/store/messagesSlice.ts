import { IMessage, IConversation } from '../types/messenger';
import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export interface IMessageList {
    messages: IMessage[];
    inputMessage: IMessage;
    currentConversaton: IConversation;
}

const initialState : IMessageList = {
    messages: [],
    inputMessage: {
        id: 1,
        conversationId: 1,
        userId: 1,
        isRead: false,
        createdAt: ''
    },
    currentConversaton: {
        id: 1,
        memberId: 1,
        username: '',
        profilePic: '',
        refUser: ''
    }
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
        setCurrentConversationData(state, action: PayloadAction<IConversation>) {
            state.currentConversaton = action.payload;
        }
    }
});

export const {
    addMessage, 
    changeInputMessage, 
    initUser, 
    setCurrentConversationData
} = MessagesSlice.actions;
export default MessagesSlice.reducer;