import {configureStore} from '@reduxjs/toolkit';
import reducerAuth from './authSlice';


const store =  configureStore({
    reducer: {
        reducerAuth: reducerAuth
    }
});

export default store;

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
