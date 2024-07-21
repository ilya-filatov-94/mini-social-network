import {TUserInfo} from './authReducer';

export interface ILikes 
extends TUserInfo {
  id?: number;
  userId?: number;
  postId: number;
}

export interface IComments 
extends Required<TUserInfo> {
  id: number;
  userId?: number;
  postId: number;
  desc: string;
  date: string;
}

export type TCommentReq = Partial<Pick<IComments, "id" | "userId" | "desc">> & Pick<IComments, "postId">;

