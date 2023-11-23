



const users = [
    {
        id: 1,
        username: "Rich Skinner",
        avatar: '',
        refUser: 'RichSkinner23'
    },
    {
        id: 2,
        username: "Tom Riddle",
        avatar: '',
        refUser: 'TomRiddle16'
    },
    {
        id: 3,
        username: "Jane Stone",
        avatar: '',
        refUser: 'JaneStone22'
    },
    {
        id: 4,
        username: "Jane Stone",
        avatar: '',
        refUser: 'JaneStone22'
    },
]

export const possibleFriends = [users[0], users[1], users[2], users[3]];

export const activitiesOfFriends = [
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

export const onlineFriends = [users[1], users[2], users[0]];

