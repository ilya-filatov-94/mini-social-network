import {TinitialUser} from './authReducer';

export interface ILikes 
extends Pick<TinitialUser, "username" | "refUser" | "profilePic"> {
  id?: number;
  userId?: number;
  postId: number;
}

export interface IComments 
extends Pick<TinitialUser, "username" | "refUser" | "profilePic"> {
  id: number;
  desc: string;
  userId: number;
  postId: number;
  createdAt?: string;
  updatedAt?: string;
  date: string;
}

export type TCommentReq = Partial<Pick<IComments, "id" | "userId" | "desc">> & Pick<IComments, "postId">;

