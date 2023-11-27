export interface IActivityOfUser {
    id: number;
    username: string;
    profilePic: string;
    refUser: string;
    createdAt: string;
    type: string;
    desc: string;
    image?: string | undefined,
}
