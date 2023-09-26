import {createSlice, PayloadAction} from '@reduxjs/toolkit';
import {IRegState, IAuthState} from '../types/authReducer';
import {ILoginData} from '../types/form';

const initialState: IAuthState = {
    users: [],
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
                localStorage.setItem('isAuth', JSON.stringify(state.isAuth));
            }
        },
        loginUser(state, action: PayloadAction<ILoginData>) {
            const {nickname, password} = action.payload;
            const currentUser = state.users.find(user => user.nickname === nickname);
            if (currentUser && currentUser.password === password) {
                state.isAuth = true;
                localStorage.setItem('isAuth', JSON.stringify(state.isAuth));
            }
        },
        logoutUser(state) {
            state.isAuth = false;
            localStorage.setItem('isAuth', JSON.stringify(state.isAuth));
        }
    }
});

export const {registerUser, loginUser, logoutUser} = authSlice.actions; 
export default authSlice.reducer;
