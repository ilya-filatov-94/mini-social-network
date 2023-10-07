export interface IUser {
    id?: number;
    name: string;
    avatar?: string | undefined;
}

export interface IActivityOfFriend 
extends IUser {
    textEvent: string;
    timeEvent: string;
}
