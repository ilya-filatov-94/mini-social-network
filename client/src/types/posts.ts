
export interface IPostData {
  id?: number;
  username: string;
  profilePic?: string | undefined;
  refUser: string;
  desc: string;
  date?: string;
  image?: string | undefined;
  counterLikes: number;
  counterComments: number;
}

export interface ILikes {
  id?: number;
  userId?: number;
  postId?: number;
  username?: string;
  refUser?: string; 
  profilePic?: string | undefined;
}

export interface ICheckData {
  message: string;
}
