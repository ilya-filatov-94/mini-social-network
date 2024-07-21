import {createSlice, PayloadAction} from '@reduxjs/toolkit';
import {IConversation, IMessage} from '../types/messenger';

export interface IConversationSlice {
    currentConversaton: IConversation;
    lastMessage: IMessage;
}

const initialState: IConversationSlice = {
    currentConversaton: {
        id: 0,
        memberId: 0,
        username: '',
        profilePic: '',
        refUser: ''
    },
    lastMessage: {
        id: 0,
        conversationId: 0,
        userId: 0,
        username: "",
        text: "",
        file: "",
        mimeTypeAttach: undefined,
        isRead: false,
        createdAt: ""
    }
}

const conversationSlice = createSlice({
    name: 'conversation',
    initialState: initialState,
    reducers: {
        setCurrentConversationData(state, action: PayloadAction<IConversation>) {
            state.currentConversaton = action.payload;
        },
        updateLastMessage(state, action: PayloadAction<IMessage>) {
            state.lastMessage = action.payload;
        },
        readmsgs() {}
    }
});

export const {
    setCurrentConversationData, 
    updateLastMessage,
} = conversationSlice.actions; 
export default conversationSlice.reducer;