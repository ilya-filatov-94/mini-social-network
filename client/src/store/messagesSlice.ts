import { IMessage, IReadMsgs } from '../types/messenger';
import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export interface IMessageList {
    inputMessage: IMessage;
    unreadMsgsList: Record<string, number>;
    readMsgsList: IReadMsgs;
    readMsgsFromServer: IReadMsgs
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
    unreadMsgsList: {},
    readMsgsList: {
        ids: [],
        conversationId: 1,
        userId: 1
    },
    readMsgsFromServer: {
        ids: [],
        userId: 1
    }
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
        updateUnreadMsgsList(state, action: PayloadAction<Record<string, number>>) {
            if (Object.keys(state.unreadMsgsList).length === 0) {
                state.unreadMsgsList = action.payload;
            } else {
                state.unreadMsgsList = {...state.unreadMsgsList, ...action.payload};
            }
        },
        changeMsgsReadStatus(state, action: PayloadAction<IReadMsgs>) {
            state.readMsgsList = action.payload;
        },
        updateReadStatusFromServer(state, action: PayloadAction<IReadMsgs>) {
            state.readMsgsFromServer = action.payload;
        },
        send() {}
    }
});

export const {
    changeInputMessage, 
    initUser,
    updateUnreadMsgsList,
    changeMsgsReadStatus,
    updateReadStatusFromServer,
    send
} = MessagesSlice.actions;
export default MessagesSlice.reducer;