import JaneAvatar from '../../assets/images/Jane-story.jpeg';
import AvatarKate from '../../assets/images/pexels-photo-1036623.jpeg';
import AvatarRich from '../../assets/images/avatar1.jpg';
import AvatarTom from '../../assets/images/avatar2.jpg';
import JohnAvatar from '../../assets/images/John-Avatar.png';
import imageStory1 from "../../assets/images/stories-1.jpeg";
import imageStory2 from "../../assets/images/stories-2.jpeg";
import imageStory3 from "../../assets/images/stories-3.jpeg";
import imageStory4 from "../../assets/images/stories-4.jpeg";
import JaneStory from '../../assets/images/Jane-story.jpeg';

import {IStory} from '../../types/story';


export const stories: IStory[] = [
      {
        id: 15,
        userId: 22,
        username: "Jane Olsen",
        profilePic: JaneAvatar,
        image: JaneStory,
        refUser: '/profile/JaneOlsen22'
      },
      {
        id: 2,
        userId: 24,
        username: "Kate Stone",
        profilePic: AvatarKate,
        image: imageStory1,
        refUser: '/profile/KateStone24'
      },
      {
        id: 3,
        userId: 25,
        username: "Mary Stark",
        profilePic: AvatarRich,
        image: imageStory2,
        refUser: '/profile/MaryStark25'
      },
      {
        id: 4,
        userId: 21,
        username: "John Doe",
        profilePic: AvatarTom,
        image: imageStory3,
        refUser: '/profile/JohnDoe21'
      },
      {
        id: 5,
        userId: 23,
        username: "Rich Skinner",
        profilePic: JohnAvatar,
        image: imageStory4,
        refUser: '/profile/RichSkinner23'
      },
      {
        id: 6,
        userId: 16,
        username: "Tom Riddle",
        profilePic: AvatarKate,
        image: imageStory4,
        refUser: '/profile/TomRiddle16'
      },
      {
        id: 7,
        userId: 23,
        username: "Rich Skinner",
        profilePic: AvatarRich,
        image: imageStory4,
        refUser: '/profile/RichSkinner23'
      },
      {
        id: 8,
        userId: 23,
        username: "Rich Skinner",
        profilePic: AvatarRich,
        image: imageStory4,
        refUser: '/profile/RichSkinner23'
      },
      {
        id: 9,
        userId: 23,
        username: "Rich Skinner",
        profilePic: AvatarRich,
        image: imageStory4,
        refUser: '/profile/RichSkinner23'
      },
      {
        id: 10,
        userId: 23,
        username: "Rich Skinner",
        profilePic: AvatarRich,
        image: imageStory4,
        refUser: '/profile/RichSkinner23'
      },
];

