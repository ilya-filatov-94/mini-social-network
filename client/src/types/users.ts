export interface IUserProfile {
    id: number;
    username: string;
    email: string;
    refUser: string;
    profilePic: string;
    coverPic: string;
    city: string;
    website: string;
    status: string;
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
