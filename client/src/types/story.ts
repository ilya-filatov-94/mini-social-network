export interface IStory {
  id: number;
  userId: number;
  username: string;
  profilePic: string | undefined;
  refUser: string;
  image?: string | undefined;
  date?: string;
}

export interface IStoryCreate
extends Pick<IStory, "id" | "image" | "userId"> {
  updatedAt: string;
  createdAt: string;
}