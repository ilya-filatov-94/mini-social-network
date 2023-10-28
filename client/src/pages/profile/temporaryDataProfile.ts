import JaneAvatar from '../../assets/images/Jane-story.jpeg';
import AvatarRich from '../../assets/images/avatar1.jpg';
import AvatarTom from '../../assets/images/avatar2.jpg';
import AvatarKate from '../../assets/images/pexels-photo-1036623.jpeg';
import JohnAvatar from '../../assets/images/John-Avatar.png';
import postImage from '../../assets/images/bg-for-registration.jpeg'
import {IUserProfile} from '../../types/users';
import {IPost} from '../../types/posts';



//TEMPORARY
export const profileData: IUserProfile[] = [
  {
    id: 10,
    username: "Jane Stone",
    email: "jane-stone@mail.ru",
    refUser: "Jane10Stone",
    profilePic: JaneAvatar,
    coverPic: "",
    city: "Не указан",
    website: "Отсутствует",
    status: "online"
  },
  {
    id: 11,
    username: "Rich Skinner",
    email: "rich-skinner@mail.ru",
    refUser: "Rich11Skinner",
    profilePic: AvatarRich,
    coverPic: "",
    city: "Не указан",
    website: "Отсутствует",
    status: "online"
  },
  {
    id: 12,
    username: "Tom Riddle",
    email: "tom-riddle@mail.ru",
    refUser: "Tom12Riddle",
    profilePic: AvatarTom,
    coverPic: "",
    city: "Не указан",
    website: "Отсутствует",
    status: "online"
  },
  {
    id: 13,
    username: "Kate Stone",
    email: "kate-stone@mail.ru",
    refUser: "Kate13Stone",
    profilePic: AvatarKate,
    coverPic: "",
    city: "Не указан",
    website: "Отсутствует",
    status: "online"
  },
  {
    id: 14,
    username: "John Doe",
    email: "john-doe@mail.ru",
    refUser: "John14Doe",
    profilePic: JohnAvatar,
    coverPic: "",
    city: "Не указан",
    website: "Отсутствует",
    status: "online"
  },
  {
    id: 15,
    username: "Jane Ostin",
    email: "jane-ostin@mail.ru",
    refUser: "Jane15Ostin",
    profilePic: "",
    coverPic: "",
    city: "Не указан",
    website: "Отсутствует",
    status: "online"
  },
];


export const posts: IPost[] = [
  {
    id: 1,
    username: "Jane Stone",
    profilePic: JaneAvatar,
    refUser: "Jane10Stone",
    desc: "Встретились с одногруппниками",
    date: "1 час назад",
    img: postImage,
    likes: 12,
    comments: [
      {
        id: 1,
        username: "Rich Skinner",
        profilePic: AvatarRich,
        refUser: "Rich11Skinner",
        desc: "Отлично погуляли!",
        date: "20 мин назад"
      },
      {
        id: 2,
        username: "Kate Stone",
        profilePic: AvatarKate,
        refUser: "Kate13Stone",
        desc: "Вот бы встретиться ещё!",
        date: "5 мин назад"
      },
    ],
  },
  {
    id: 2,
    username: "Jane Stone",
    profilePic: JaneAvatar,
    refUser: "Jane10Stone",
    desc: "Недавно прочла \"Три товарища\" Ремарка",
    date: "2 часа назад",
    img: undefined,
    likes: 1,
    comments: [
      {
        id: 2,
        username: "Kate Stone",
        profilePic: AvatarKate,
        refUser: "Kate13Stone",
        desc: "Я тоже читала, книга - супер!",
        date: "7 мин назад"
      },
    ],
  },
];
