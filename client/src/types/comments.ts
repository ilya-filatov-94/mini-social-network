
export interface IComments {
  id: number;
  desc: string;
  userId: number;
  postId: number;
  createdAt?: string;
  updatedAt?: string;
  username: string;
  refUser: string;
  profilePic?: string | undefined;
  date: string;
}

export interface ICommentReq {
  id?: number;
  userId?: number;
  postId: number;
  desc?: string;
}
