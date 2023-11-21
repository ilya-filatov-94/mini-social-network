
import {IUser, IActivityOfFriend} from '../../types/users';




const users: IUser[] = [
    {
        id: 1,
        name: "Rich Skinner",
        avatar: '',
    },
    {
        id: 2,
        name: "Tom Riddle",
        avatar: '',
    },
    {
        id: 3,
        name: "Jane Stone",
        avatar: '',
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

