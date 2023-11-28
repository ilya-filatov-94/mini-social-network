export interface IActivityOfUser {
    id: number;
    username: string;
    profilePic: string;
    refUser: string;
    createdAt: string;
    type: string;
    desc: string;
    content?: string;
    image?: string | undefined,
}
