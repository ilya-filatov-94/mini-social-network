import {TUserInfo} from './authReducer';

export interface IPostData {
  id?: number;
  user: TUserInfo;
  desc: string;
  image?: string | undefined;
  date?: string;
  counterComments: number;
}

export interface ILikes 
extends TUserInfo {
  userId?: number;
  postId: number;
}

export interface ICheckData {
  message: string;
}
