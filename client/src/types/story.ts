export interface IStory {
  id: number;
  username: string;
  profilePic: string | undefined;
  refUser: string;
  image?: string | undefined;
  date?: string;
}

export interface IStoryCreate {
  id: number;
  image: string;
  userId: number;
  updatedAt: string;
  createdAt: string;
}