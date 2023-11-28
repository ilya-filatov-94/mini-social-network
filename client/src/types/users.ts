import {IUserData} from './authReducer';

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

export interface IUpdateData {
    username?: string;
    refUser?: string;
    profilePic?: string;
}

export interface IUser {
    id: number;
    name: string;
    avatar?: string | undefined;
}

export interface IFollower 
extends IUserData {
    refUser: string;
}

export interface IActivityOfFriend 
extends IUser {
    textEvent: string;
    timeEvent: string;
}

export interface IListUsers {
    id: number;
    username: string;
    refUser: string;
    profilePic: string | undefined,
    status: string;
    city: string;
    subscrStatus: boolean;
}

export interface IActionSubscribeTo {
    id?: number;
    curUserId: number;
    followerId: number;
}

export interface IPossibleFriend {
    id: number;
    username: string;
    refUser: string;
    profilePic: string | undefined;
    numberMutualFriends?: number;
    status?: string;
}

export interface IRequestMutualFriend {
    id: number;
    pos_id: number;
}