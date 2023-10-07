
export interface IComments {
  id: number;
  userId: number;
  username: string;
  profilePicture?: string | undefined;
  desc: string;
  date: string;
}