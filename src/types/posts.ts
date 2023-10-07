import {IinitialUser} from './authReducer';
import {IComments} from './comments';


export interface IPost 
extends IinitialUser {
  desc: string;
  date: string;
  img?: string | undefined;
  likes: number;
  comments: IComments[] | [];
}

