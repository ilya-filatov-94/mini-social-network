import {createSlice, PayloadAction} from '@reduxjs/toolkit';
import {IConversation} from '../types/messenger';

export interface IConversationSlice {
    currentConversaton: IConversation;
}

const initialState: IConversationSlice = {
    currentConversaton: {
        id: 0,
        memberId: 0,
        username: '',
        profilePic: '',
        refUser: ''
    }
}

const conversationSlice = createSlice({
    name: 'conversation',
    initialState: initialState,
    reducers: {
        setCurrentConversationData(state, action: PayloadAction<IConversation>) {
            state.currentConversaton = action.payload;
        },
    }
});

export const {setCurrentConversationData} = conversationSlice.actions; 
export default conversationSlice.reducer;