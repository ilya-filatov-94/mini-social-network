import JaneAvatar from '../../assets/images/Jane-story.jpeg';
import AvatarRich from '../../assets/images/avatar1.jpg';
import AvatarTom from '../../assets/images/avatar2.jpg';
import AvatarKate from '../../assets/images/pexels-photo-1036623.jpeg';
import JohnAvatar from '../../assets/images/John-Avatar.png';
import postImage from '../../assets/images/bg-for-registration.jpeg'
import {IinitialUser} from '../../types/authReducer';
import {IPost} from '../../types/posts';


//TEMPORARY
export const profileData: IinitialUser[] = [
  {
    id: 1,
    userId: "JaneStone",
    nickname: "Jane",
    username: "Jane Stone",
    profilePic: JaneAvatar,
  },
  {
    id: 2,
    userId: "RichSkinner",
    nickname: "Rich",
    username: "Rich Skinner",
    profilePic: AvatarRich,
  },
  {
    id: 3,
    userId: "TomRiddle",
    nickname: "Tom",
    username: "Tom Riddle",
    profilePic: AvatarTom,
  },
  {
    id: 4,
    userId: "KateStone",
    nickname: "Kate",
    username: "Kate Stone",
    profilePic: AvatarKate,
  },
  {
    id: 5,
    userId: "JohnDoe",
    nickname: "John",
    username: "John Doe",
    profilePic: JohnAvatar,
  },
  {
    id: 6,
    userId: "JaneOstin",
    nickname: "Jane",
    username: "Jane Ostin",
    refUser: "JaneOstin",
    profilePic: undefined,
  },
];

export const posts: IPost[] = [
  {
    id: 1,
    userId: 1,
    nickname: "Jane",
    username: "Jane Stone",
    profilePic: JaneAvatar,
    desc: "Встретились с одногруппниками",
    date: "1 час назад",
    img: postImage,
    likes: 12,
    comments: [
      {
        id: 1,
        userId: 1,
        username: "Rich Skinner",
        profilePicture: AvatarRich,
        desc: "Отлично погуляли!",
        date: "20 мин назад"
      },
      {
        id: 2,
        userId: 2,
        username: "Kate Stone",
        profilePicture: AvatarKate,
        desc: "Вот бы встретиться ещё!",
        date: "5 мин назад"
      },
    ],
  },
  {
    id: 2,
    userId: 2,
    nickname: "Jane",
    username: "Jane Stone",
    profilePic: JaneAvatar,
    desc: "Недавно прочла \"Три товарища\" Ремарка",
    date: "2 часа назад",
    img: undefined,
    likes: 1,
    comments: [
      {
        id: 2,
        userId: 2,
        username: "Kate Stone",
        profilePicture: AvatarKate,
        desc: "Я тоже читала, книга - супер!",
        date: "7 мин назад"
      },
    ],
  },
];
