import {createSlice, PayloadAction} from '@reduxjs/toolkit';
import {IConversation} from '../types/messenger';

export interface IConversationSlice {
    currentConversaton: IConversation;
    lastMessage: string | undefined;
}

const initialState: IConversationSlice = {
    currentConversaton: {
        id: 0,
        memberId: 0,
        username: '',
        profilePic: '',
        refUser: ''
    },
    lastMessage: '',
}

const conversationSlice = createSlice({
    name: 'conversation',
    initialState: initialState,
    reducers: {
        setCurrentConversationData(state, action: PayloadAction<IConversation>) {
            state.currentConversaton = action.payload;
        },
        updateLastMessage(state, action: PayloadAction<string | undefined>) {
            state.lastMessage = action.payload;
        }
    }
});

export const {setCurrentConversationData, updateLastMessage} = conversationSlice.actions; 
export default conversationSlice.reducer;