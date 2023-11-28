import mockImage from '../../assets/images/bg-for-registration.jpeg';

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
        content: "",
        image: '',
        createdAt: "2023-11-25T17:29:46.304Z"
    },
    {
        ...users[1],
        type: "addedComment",
        desc: "Пользователь1 прокомментировал пост Пользователя2",
        content: "Новый коммент",
        image: mockImage,
        createdAt: "2023-11-27T19:09:46.304Z"
    },
    {
        ...users[2],
        type: "addedPost",
        desc: "Создал новый пост",
        content: "Новый пост",
        image: mockImage,
        createdAt: "2023-11-27T17:29:46.304Z"
    },
    {
        ...users[3],
        type: "addedStory",
        desc: "Добавил новую историю",
        content: "",
        image: mockImage,
        createdAt: "2023-11-27T19:12:46.304Z"
    }
];

export const onlineFriends = [users[1], users[2], users[0]];

