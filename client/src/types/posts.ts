
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

export interface ICheckData {
  message: string;
}
