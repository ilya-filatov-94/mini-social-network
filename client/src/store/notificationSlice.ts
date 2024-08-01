import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { INotification } from '../types/notifications';

interface INotificationSlice {
    newNotification: INotification;
    deletedNotification: INotification;
    notifications: INotification[];
}

const initialNotification: INotificationSlice = {
    newNotification: {
        id: 0,
        userId: 1,
        ref: '',
        type: '',
        isRead: false,
    },
    deletedNotification : {
        id: 0,
        userId: 1,
        ref: '',
        type: '',
        isRead: false,
    },
    notifications: [],
}

const notificationSlice = createSlice({
    name: 'notifications',
    initialState: initialNotification,
    reducers: {
        emitNotification(state, action: PayloadAction<INotification>) {
            state.newNotification = action.payload;
        },
        addNotification(state, action: PayloadAction<INotification>) {
            state.notifications.push(action.payload);
        },
        fillNotifications(state, action: PayloadAction<INotification[]>) {
            state.notifications.push(...action.payload);
        },
        readNotifications(state) {
            state.notifications.forEach(item => item.isRead = true);
        }
    }
});

export const {
    emitNotification, 
    readNotifications,
    addNotification,
    fillNotifications
} = notificationSlice.actions; 
export default notificationSlice.reducer;