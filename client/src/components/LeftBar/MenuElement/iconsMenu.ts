import Friends from '../../../assets/images/Friends.png';
import Groups from '../../../assets/images/Groups.png';
import Market from '../../../assets/images/Market.png';
import Watch from '../../../assets/images/Watch.png';
import Memories from '../../../assets/images/Memories.png';
import Events from '../../../assets/images/Events.png';
import Gaming from '../../../assets/images/Gaming.png';
import Gallery from '../../../assets/images/Gallery.png';
import Videos from '../../../assets/images/Videos.png';
import Messages from '../../../assets/images/Messages.png';
import Courses from '../../../assets/images/Courses.png';
// import Tutorials from '../../../assets/images/Tutorials.png';
// import Fund from '../../../assets/images/Fund.png';
import {IMenu} from '../../../types/menu';


export const basicMenuIcons: IMenu[] = [
    {
        id: 1,
        name: 'Друзья',
        image: Friends,
        menuRef: '/friends'
    },
    {
        id: 2,
        name: 'Сообщения',
        image: Messages,
        menuRef: '/conversations'
    },
    {
        id: 3,
        name: 'Галерея',
        image: Gallery,
        menuRef: '/gallery'
    },
    {
        id: 4,
        name: 'Группы',
        image: Groups,
        menuRef: '/groups'
    },

    {
        id: 5,
        name: 'Воспоминания',
        image: Memories,
        menuRef: '/memories'
    },
];


export const shortcutsMenuIcons: IMenu[] = [
    {
        id: 6,
        name: 'События',
        image: Events,
        menuRef: '/events'
    },
    {
        id: 7,
        name: 'Игры',
        image: Gaming,
        menuRef: '/games'
    },
    {
        id: 8,
        name: 'Магазин',
        image: Market,
        menuRef: '/market'
    },
    {
        id: 9,
        name: 'Кинотеатр',
        image: Watch,
        menuRef: '/watch'
    },

    {
        id: 10,
        name: 'Видео',
        image: Videos,
        menuRef: '/videos'
    },
];


export const otherMenuIcons: IMenu[] = [
    {
        id: 11,
        name: 'Курсы',
        image: Courses,
        menuRef: '/courses'
    },
    // {
    //     id: 12,
    //     name: 'Обучение',
    //     image: Tutorials,
    //     menuRef: '/tutorials'
    // },
    // {
    //     id: 13,
    //     name: 'Пожертвования',
    //     image: Fund,
    //     menuRef: '/fund'
    // },
];

