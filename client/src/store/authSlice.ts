import {createSlice, createAsyncThunk, AnyAction, PayloadAction} from '@reduxjs/toolkit';
import {AppDispatch} from './index';
import axios from 'axios';
import jwt_decode from "jwt-decode";

import {
    IRegState, 
    IAuthState, 
    IAccessToken, 
    IResponse, 
    ILoginState, 
    IResponseLogout
} from '../types/authReducer';
import {initialStateUser} from './initialStore';
import {API_URL} from '../env_variables';


interface IAsyncAuthState
extends IAuthState {
    status: string;
    error: string | null;
}

const initialState: IAsyncAuthState = {
    isAuth: false,
    currentUser: initialStateUser,
    accessToken: '',
    status: '',
    error: null
}


export const registerUser = createAsyncThunk<IResponse, IRegState, {rejectValue: string, dispatch: AppDispatch}>(
    'authService/registerUser',
    function (data, {rejectWithValue, dispatch}) {
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
        .catch((error: unknown) => {
            if (error instanceof axios.AxiosError) {
                dispatch(setErrorStatus(error?.response?.status));
                if (error?.response?.data?.message) {
                    return rejectWithValue(error?.response?.data?.message);
                }
                if (error?.message) {
                    if (error?.message === 'Network Error') {
                        dispatch(setErrorStatus(500));
                    }
                    return rejectWithValue(error?.message);
                }
                return rejectWithValue(error?.message);
            }
            dispatch(setErrorStatus(500));
            return rejectWithValue(error as string);
        });
    }
);

export const loginUser = createAsyncThunk<IResponse, ILoginState, {rejectValue: string, dispatch: AppDispatch}>(
    'authService/loginUser',
    function (data, {rejectWithValue, dispatch}) {
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
        .catch((error: unknown) => {
            if (error instanceof axios.AxiosError) {
                dispatch(setErrorStatus(error?.response?.status));
                if (error?.response?.data?.message) {
                    return rejectWithValue(error?.response?.data?.message);
                }
                if (error?.message) {
                    if (error?.message === 'Network Error') {
                        dispatch(setErrorStatus(500));
                    }
                    return rejectWithValue(error?.message);
                }
                return rejectWithValue(error?.message);
            }
            dispatch(setErrorStatus(500));
            return rejectWithValue(error as string);
        });
    }
);

export const logoutUser = createAsyncThunk<IResponseLogout, number, {rejectValue: string, dispatch: AppDispatch}>(
    'authService/logoutUser',
    function (data, {rejectWithValue, dispatch}) {
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
        .catch((error: unknown) => {
            if (error instanceof axios.AxiosError) {
                dispatch(setErrorStatus(error?.response?.status));
                if (error?.response?.data?.message) {
                    return rejectWithValue(error?.response?.data?.message);
                }
                if (error?.message) {
                    if (error?.message === 'Network Error') {
                        dispatch(setErrorStatus(500));
                    }
                    return rejectWithValue(error?.message);
                }
                return rejectWithValue(error?.message);
            }
            dispatch(setErrorStatus(500));
            return rejectWithValue(error as string);
        });
    }
);

const authSlice = createSlice({
    name: 'authService',
    initialState: initialState,
    reducers: {
        setErrorStatus(state, action: PayloadAction<number | undefined>) {
            state.status = String(action.payload);
            if (action.payload === undefined) {
                state.error = '';
            }
        },
    },
    extraReducers: (builder) => {
        builder
        .addCase(registerUser.pending, (state) => {
            state.status = 'loading';
            state.error = null;
        })
        .addCase(registerUser.fulfilled, (state, action) => {
            state.status = 'resolved';
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
            state.status = 'loading';
            state.error = null;
        })
        .addCase(loginUser.fulfilled, (state, action) => {
            state.status = 'resolved';
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
            state.status = 'loading';
            state.error = null;
        })
        .addCase(logoutUser.fulfilled, (state) => {
            state.status = 'resolved';
            state.error = null;

            state.currentUser.profilePic = "";
            state.currentUser.refUser = "";
            state.currentUser.username = "";
            state.accessToken ="";
            state.isAuth = false;
        })
        .addMatcher(isError, (state, action: PayloadAction<string>) => {
            state.error = action.payload;
        })

    },
});

function isError(action: AnyAction) {
    return action.type.endsWith('rejected');
}

export const {setErrorStatus} = authSlice.actions; 
export default authSlice.reducer;
