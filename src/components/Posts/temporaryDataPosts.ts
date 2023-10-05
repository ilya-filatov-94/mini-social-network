import avatarKate from '../../assets/images/pexels-photo-1036623.jpeg';
import AvatarRich from '../../assets/images/avatar1.jpg';
import JaneAvatar from '../../assets/images/Jane-story.jpeg';
import postImage from '../../assets/images/bg-for-registration.jpeg';
import {IPost} from '../../types/posts';


//TEMPORARY
export const posts: IPost[] = [
    {
      id: 1,
      userId: 1,
      nickname: "Kate",
      username: "Kate Stone",
      profilePic: avatarKate,
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
          username: "Jane Stone",
          profilePicture: JaneAvatar,
          desc: "Вот бы встретиться ещё!",
          date: "5 мин назад"
        },
      ],
    },
    {
      id: 2,
      userId: 2,
      nickname: "Kate",
      username: "Kate Stone",
      profilePic: avatarKate,
      desc: "Недавно прочла \"Три товарища\" Ремарка",
      date: "2 часа назад",
      img: null,
      likes: 1,
      comments: [
        {
          id: 2,
          userId: 2,
          username: "Jane Stone",
          profilePicture: JaneAvatar,
          desc: "Я тоже читала, книга - супер!",
          date: "7 мин назад"
        },
      ],
    },
];
