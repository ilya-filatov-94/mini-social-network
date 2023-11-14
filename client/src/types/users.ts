export interface IUpdateData {
    username: string;
    refUser: string;
}

export interface IUpdateFormUser {
    ref: string;
    dataUser: FormData;
}

export interface IUserFullData {
    id?: number;
    name?: string;
    lastname?: string;
    refUser?: string;
    email?: string;
    profilePic?: string;
    coverPic?: string;
    city?: string;
    website?: string;
    password?: string;
}

export interface IUser {
    id: number;
    name: string;
    avatar?: string | undefined;
}

export interface IActivityOfFriend 
extends IUser {
    textEvent: string;
    timeEvent: string;
}
