import {FC, useState} from 'react';
import styles from './Likes.module.scss';
import {useAppSelector} from '../../../hooks/useTypedRedux';
import FavoriteOutlinedIcon from "@mui/icons-material/FavoriteOutlined";
import FavoriteBorderOutlinedIcon from "@mui/icons-material/FavoriteBorderOutlined";
import noAvatar from '../../../assets/images/no-avatar.jpg';
import {IUser} from '../../../types/users';

interface ILikesProps {
  likes: IUser[];
  curTheme: string;
}

const Likes: FC<ILikesProps> = ({likes, curTheme}) => {

  const currUser = useAppSelector(state => state.reducerAuth.currentUser);
  const [currLikes, changeLikes] = useState<IUser[]>(likes || []);
  const hasLike = currLikes.filter(item => item.name === currUser.username);

  function toggleLike() {
    if (!hasLike.length) {
      changeLikes([{id: currUser.id, name: currUser.username, avatar: currUser.profilePic}, ...currLikes]);
    }
    if (hasLike.length) {
      const newArr = currLikes.filter(item => item.name !== currUser.username);
      changeLikes(newArr);
    }
  }
  
  return (
    <div className={`${styles.wrapper} ${curTheme ==='darkMode' 
    ? styles['theme-dark'] 
    : styles['theme-light']}`}>
      <div className={`${styles.wrapperIcon} ${currLikes.length > 0 ? styles.icon : ''}`}>
        {currLikes.length > 0 &&
        <div className={styles.users}>
            <div className={styles.avatars}>
            {currLikes.map((like, index) => {
                if (index <= 4) return (
                <img  
                    key={like.id}
                    className={styles.img} 
                    src={like.avatar ? like.avatar : noAvatar} 
                    alt='Фото польз.' 
                />)
                return null;
            })}
            </div>
            {currLikes.length === 1 &&
                <span>Нравится {currLikes[0].name}</span>
            }
            {currLikes.length > 1 &&
                <span>Нравится {currLikes[0].name} и ещё {currLikes.length-1}</span>
            }
        </div>
        }
        <div className={styles.wrapperIcon} onClick={toggleLike}>
        {hasLike.length
           ? <FavoriteOutlinedIcon className={styles.like}/>
           : <FavoriteBorderOutlinedIcon />
        }
        <span className={styles.textLike}>{currLikes.length} Нравится</span>
        <span className={styles.mobileInfo}>{currLikes.length}</span>
        </div>
      </div>
    </div>
  )
}

export default Likes;
