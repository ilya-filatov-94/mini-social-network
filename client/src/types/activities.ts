export interface IActivityOfUser {
    id: number;
    username: string;
    profilePic: string;
    refUser: string;
    createdAt: string;
    type: string;
    desc: string;
    text?: string;
    image?: string | undefined,
}
