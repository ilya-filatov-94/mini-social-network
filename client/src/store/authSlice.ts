import {createSlice, createAsyncThunk, AnyAction, PayloadAction} from '@reduxjs/toolkit';
import axios from 'axios';
import jwt_decode from "jwt-decode";

import {IRegState, IAuthState, IAccessToken, IResponse, IResponseLogout} from '../types/authReducer';
import {initialStateUser} from './initialStore';
import {ILoginData} from '../types/form';
import {API_URL} from '../env_variables';


interface IAsyncAuthState
extends IAuthState {
    loading: boolean,
    error: string | null,
}

const initialState: IAsyncAuthState = {
    isAuth: false,
    currentUser: initialStateUser,
    accessToken: '',
    loading: false,
    error: null
}

export const registerUser = createAsyncThunk<IResponse, IRegState, {rejectValue: string}>(
    'authService/registerUser',
    async function (data, {rejectWithValue}) {
        return axios.post(API_URL + '/user/registration',
        {...data},
        {
            withCredentials: true,
            headers: {
                'Content-Type': 'multipart/form-data'
            }
        })
        .then((response) => {
            return response.data as IResponse;
        })
        .catch((error) => {
            console.log('Ошибка!', error);
            return rejectWithValue(error.message as string);
        });
    }
);

export const loginUser = createAsyncThunk<IResponse, ILoginData, {rejectValue: string}>(
    'authService/loginUser',
    async function (data, {rejectWithValue}) {
        return axios.post(API_URL + '/user/login',
        {...data},
        {
            withCredentials: true,
            headers: {
                'Content-Type': 'multipart/form-data'
            }
        })
        .then((response) => {
            return response.data as IResponse;
        })
        .catch((error) => {
            console.log('Ошибка!', error);
            return rejectWithValue(error.message as string);
        });
    }
);

export const logoutUser = createAsyncThunk<IResponseLogout, number, {rejectValue: string}>(
    'authService/logoutUser',
    async function (data, {rejectWithValue}) {
        return axios.post(API_URL + '/user/logout',
        {id: data},
        {
            withCredentials: true,
            headers: {
                'Content-Type': 'application/json'
            }
        })
        .then((response) => {
            return response.data as IResponseLogout;
        })
        .catch((error) => {
            console.log('Ошибка!', error);
            return rejectWithValue(error.message as string);
        });
    }
);

const authSlice = createSlice({
    name: 'authService',
    initialState: initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
        .addCase(registerUser.pending, (state) => {
            state.loading = true;
            state.error = null;
        })
        .addCase(registerUser.fulfilled, (state, action) => {
            state.loading = false;
            state.error = null;
            const {accessToken, user} = action.payload;
            const {id, refUser} = jwt_decode<IAccessToken>(accessToken);
          
            state.currentUser = {
                id: id,
                username: user.username,
                refUser: refUser,
                profilePic: user.profilePic,
            };
            state.isAuth = true;
            state.accessToken = accessToken;
        })
        .addCase(loginUser.pending, (state) => {
            state.loading = true;
            state.error = null;
        })
        .addCase(loginUser.fulfilled, (state, action) => {
            state.loading = false;
            state.error = null;
            const {accessToken, user} = action.payload;
            const {id, refUser} = jwt_decode<IAccessToken>(accessToken);
          
            state.currentUser = {
                id: id,
                username: user.username,
                refUser: refUser,
                profilePic: user.profilePic,
            };
            state.isAuth = true;
            state.accessToken = accessToken;
        })
        .addCase(logoutUser.pending, (state) => {
            state.loading = true;
            state.error = null;
        })
        .addCase(logoutUser.fulfilled, (state) => {
            state.loading = false;
            state.error = null;

            state.currentUser.profilePic = "";
            state.currentUser.refUser = "";
            state.currentUser.username = "";
            state.isAuth = false;
        })
        .addMatcher(isError, (state, action: PayloadAction<string>) => {
            state.error = action.payload;
            state.loading = false;
        })

    },
});

function isError(action: AnyAction) {
    return action.type.endsWith('rejected');
}

export default authSlice.reducer;
