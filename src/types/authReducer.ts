
export interface IRegState {
    id?: string;
    nickname: string;
    email: string;
    password: string;
    username: string;
}

export interface IAuthState {
    users: IRegState[];
    isAuth: boolean;
} 
