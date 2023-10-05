import {createSlice, PayloadAction} from '@reduxjs/toolkit';

import {IRegState, IAuthState} from '../types/authReducer';
import {ILoginData} from '../types/form';

import {initialStateUsers} from './initialStore';

const initialState: IAuthState = {
    users: [],
    currentUser: initialStateUsers[0],
    isAuth: false
}

const authSlice = createSlice({
    name: 'authService',
    initialState: initialState,
    reducers: {
        registerUser(state, action: PayloadAction<IRegState>) {
            const {nickname, email, password, username} = action.payload;
            const newUser = state.users.find(user => user.nickname === nickname);
            if (!newUser) {
                const id = `${nickname}.${email}.${username}`;
                state.users.push({
                    id: id,
                    nickname: nickname,
                    email: email,
                    password: password,
                    username: username
                });
                state.isAuth = true;
            }
        },
        loginUser(state, action: PayloadAction<ILoginData>) {
            const {nickname, password} = action.payload;
            const currentUser = state.users.find(user => user.nickname === nickname);
            if (currentUser && currentUser.password === password) {
                state.currentUser = currentUser;
                if (currentUser.username === initialStateUsers[0].username) {
                    state.currentUser.profileImg = initialStateUsers[0].profileImg;
                }
                state.isAuth = true;
            }
        },
        logoutUser(state) {
            state.isAuth = false;
        }
    }
});


export const {registerUser, loginUser, logoutUser} = authSlice.actions; 
export default authSlice.reducer;
