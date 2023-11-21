
export interface IRegState {
    username: string;
    email: string;
    password: string;
}

export interface ILoginState {
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
    id: number;
    username: string;
    profilePic: string | undefined;
    coverPic: string | undefined;
    city: string;
    website: string;
    status: string;
    isSubscriber?: boolean;
}

export interface IRequestProfile {
    ref: string;
    id: number;
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

export interface IReAuthResponse {
    accessToken: string;
}

export interface IAuthState {
    currentUser: IinitialUser;
    isAuth: boolean;
    accessToken: string;
}

export interface IResponseLogout {
    id: string;
}