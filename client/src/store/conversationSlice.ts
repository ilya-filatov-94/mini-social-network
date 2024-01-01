import {createSlice, PayloadAction} from '@reduxjs/toolkit';
import {IConversation} from '../types/messenger';

interface ILastMessage {
    text?: string | undefined;
    file?: string | undefined;
}

export interface IConversationSlice {
    currentConversaton: IConversation;
    lastMessage: ILastMessage;
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
        text: '',
        file: '',
    },
}

const conversationSlice = createSlice({
    name: 'conversation',
    initialState: initialState,
    reducers: {
        setCurrentConversationData(state, action: PayloadAction<IConversation>) {
            state.currentConversaton = action.payload;
        },
        updateLastMessage(state, action: PayloadAction<ILastMessage>) {
            state.lastMessage.text = action.payload?.text;
            state.lastMessage.file = action.payload?.file;
        }
    }
});

export const {setCurrentConversationData, updateLastMessage} = conversationSlice.actions; 
export default conversationSlice.reducer;