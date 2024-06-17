import {TUserInfo} from './authReducer';

export interface IActivityOfUser {
    id: number;
    user: TUserInfo;
    createdAt: string;
    type: string;
    desc: string;
    text?: string;
    image?: string | undefined,
}
