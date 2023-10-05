export interface IinitialUser {
    id?: string | number;
    userId?: string;
    nickname: string;
    email?: string;
    password?: string;
    username: string;
    refUser?: string;
    profileImg?: any;
}

export interface IRegState {
    id?: string | number;
    nickname: string;
    email: string;
    password: string;
    username: string;
    refUser?: string;
    profileImg?: any;
}

export interface IAuthState {
    users: IRegState[];
    currentUser: IinitialUser;
    isAuth: boolean;
} 
