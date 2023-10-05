import {IinitialUser} from '../types/authReducer';
import JohnAvatar from '../assets/images/John-Avatar.png';


export const initialStateUsers: IinitialUser[] = [
    {
        id: `John.john-doe@mail.ru.John`,
        userId: "JohnDoe",
        nickname: "John",
        username: "John Doe",
        refUser: "JohnDoe",
        profileImg: JohnAvatar,
    }
];
