import AvatarRich from '../../assets/images/avatar1.jpg';
import AvatarTom from '../../assets/images/avatar2.jpg';
import JaneStory from '../../assets/images/Jane-story.jpeg';
import {IUser, IActivityOfFriend} from '../../types/users';




const users: IUser[] = [
    {
        id: 1,
        name: "Rich Skinner",
        avatar: AvatarRich,
    },
    {
        id: 2,
        name: "Tom Riddle",
        avatar: AvatarTom,
    },
    {
        id: 3,
        name: "Jane Stone",
        avatar: JaneStory,
    },
]

export const possibleFriends: IUser[] = [users[0], users[1]];

export const activitiesOfFriends: IActivityOfFriend[] = [
    {
        ...users[0], 
        textEvent: "Добавил новое фото",
        timeEvent: "1 мин"
    },
    {
        ...users[1], 
        textEvent: "Добавил новое фото",
        timeEvent: "1 мин"
    },
    {
        ...users[2], 
        textEvent: "Обновила фото",
        timeEvent: "5 мин"
    },
];

export const onlineFriends: IUser[] = [users[1], users[2], users[0]];

