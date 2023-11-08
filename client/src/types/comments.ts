
export interface IComments {
  id?: number;
  userId: number;
  postId: number;
  username: string;
  profilePic?: string | undefined;
  refUser: string;
  desc: string;
  date: string;
}

export interface ICommentReq {
  userId: number;
  postId: number;
  desc?: string;
}
