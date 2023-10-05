import {IComments} from './comments';

export interface IPost {
  id: number;
  userId?: number;
  nickname: string;
  username: string;
  profilePic?: any;
  desc: string;
  date: string;
  img?: any;
  likes: number;
  comments: IComments[] | [];
}

