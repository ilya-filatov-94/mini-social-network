export interface IRegState {
    username: string;
    email: string;
    password: string;
}

export type TLoginState = Pick<IRegState, "email" | "password">;

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

export type TinitialUser = Pick<IUserData, "id" | "username" | "profilePic"> & Partial<Pick<IUserData, "status">> & {refUser: string};

export interface IRequestProfile {
    ref: string;
    id: number;
}

export interface IResponse {
    accessToken: string,
    user: TinitialUser;
}

export type TReAuthResponse = Pick<IResponse, "accessToken">;

export interface IAuthState {
    currentUser: TinitialUser;
    isAuth: boolean;
    accessToken: string;
}

export interface IResponseLogout {
    id: string;
}

export type TUserInfo = Pick<TinitialUser, "username" | "refUser" | "profilePic">;