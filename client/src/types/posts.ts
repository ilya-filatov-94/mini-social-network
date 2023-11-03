import {IComments} from './comments';

export interface IPostData {
  id?: number;
  username: string;
  profilePic: string;
  refUser: string;
  desc: string;
  date?: string;
  img?: string | undefined;
  counterLikes: number;
  counterComments: number;
}

export interface IPost {
  id: number;
  username: string;
  profilePic: string;
  refUser: string;
  desc: string;
  date: string;
  img?: string | undefined;
  likes: number;
  comments: IComments[];
}
