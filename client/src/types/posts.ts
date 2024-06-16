import {TinitialUser} from './authReducer';

export type TUserInfo = Pick<TinitialUser, "username" | "refUser" | "profilePic">;

export interface IPostData {
  id?: number;
  user: TUserInfo;
  desc: string;
  image?: string | undefined;
  date?: string;
  counterComments: number;
}

export interface ILikes 
extends Pick<TinitialUser, "username" | "refUser" | "profilePic"> {
  id?: number;
  userId?: number;
  postId: number;
}

export interface ICheckData {
  message: string;
}
