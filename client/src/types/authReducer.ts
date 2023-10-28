
export interface IRegState {
    username: string;
    email: string;
    password: string;
}

export interface IAccessToken {
    id: number,
    refUser: string;
    email: string;
    iat: number;
    exp: number;
}

export interface IUserData {
    username: string;
    profilePic: string | undefined;
    coverPic: string | undefined;
    city: string;
    website: string;
    status: string;
}

export interface IinitialUser {
    id: number;
    username: string;
    refUser: string;
    profilePic: string | undefined;
}

export interface IResponse {
    accessToken: string,
    user: IinitialUser;
}

export interface IAuthState {
    currentUser: IinitialUser;
    isAuth: boolean;
    accessToken: string;
}

export interface IResponseLogout {
    id: string;
}