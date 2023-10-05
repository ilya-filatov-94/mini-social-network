export interface IUser {
    id?: number;
    name: string;
    avatar?: any;
}

export interface IActivityOfFriend 
extends IUser {
    textEvent: string;
    timeEvent: string;
}
