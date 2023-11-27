

const users = [
    {
        id: 1,
        username: "Rich Skinner",
        profilePic: '',
        refUser: 'RichSkinner23'
    },
    {
        id: 2,
        username: "Tom Riddle",
        profilePic: '',
        refUser: 'TomRiddle16'
    },
    {
        id: 3,
        username: "Jane Stone",
        profilePic: '',
        refUser: 'JaneStone22'
    },
    {
        id: 4,
        username: "Jane Stone",
        profilePic: '',
        refUser: 'JaneStone22'
    },
]

export const possibleFriends = [users[0], users[1], users[2], users[3]];

export const activitiesOfFriends = [
    {
        ...users[0],
        type: "updatedAvatar",
        desc: "Обновил фотографию профиля",
        createdAt: "2023-11-25T17:29:46.304Z"
    },
    {
        ...users[1],
        type: "addedComment",
        desc: "Пользователь1 прокомментировал пост Пользователя2",
        createdAt: "2023-11-27T19:09:46.304Z"
    },
    {
        ...users[2],
        type: "addedPost",
        desc: "Создал новый пост",
        createdAt: "2023-11-27T17:29:46.304Z"
    },
    {
        ...users[3],
        type: "addedStory",
        desc: "Добавил новую историю",
        createdAt: "2023-11-27T19:12:46.304Z"
    }
];

export const onlineFriends = [users[1], users[2], users[0]];

