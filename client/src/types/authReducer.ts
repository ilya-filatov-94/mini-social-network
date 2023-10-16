export interface IRegState {
    id?: string | number;
    nickname: string;
    email?: string;
    password?: string;
    username: string;
    refUser?: string;
    profilePic?: string | undefined;
}

export interface IinitialUser 
extends IRegState {
    userId?: string | number;
}

export interface IAuthState {
    users: IRegState[];
    currentUser: IinitialUser;
    isAuth: boolean;
} 
