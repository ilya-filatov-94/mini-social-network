import {FC, useState, useEffect} from 'react';
import styles from './Likes.module.scss';
import {useAppSelector} from '../../../hooks/useTypedRedux';
import FavoriteOutlinedIcon from "@mui/icons-material/FavoriteOutlined";
import FavoriteBorderOutlinedIcon from "@mui/icons-material/FavoriteBorderOutlined";
import noAvatar from '../../../assets/images/no-avatar.jpg';
import {ILikes} from '../../../types/posts';
import {
  useGetLikesQuery,
  useAddLikeMutation,
  useRemoveLikeMutation
} from '../../../services/PostService';
import Loader from '../../Loader/Loader';
import Alert from '@mui/material/Alert';
import { 
  FetchBaseQueryError,
} from "@reduxjs/toolkit/query/react";

interface ILikesProps {
  postId: number;
  curTheme: string;
}

const Likes: FC<ILikesProps> = ({postId, curTheme}) => {

  const {
    data: likes, 
    error: errorLoad, 
    isLoading: isLoadingLikes,
  } = useGetLikesQuery(postId);
  const [addLike, {error: errorAddLike}] = useAddLikeMutation();
  const [removeLike, {error: errorRemoveLike}] = useRemoveLikeMutation();
  const isFetchBaseQueryErrorType = (error: any): error is FetchBaseQueryError => 'status' in error;
  const [currLikes, changeLikes] = useState<ILikes[]>([]);
  
  useEffect(() => {
    if (likes?.length && !currLikes?.length) {
      changeLikes(likes);
    }
  // eslint-disable-next-line
  }, [likes]);
  const counterLikes = currLikes.length;
  const currUser = useAppSelector(state => state.reducerAuth.currentUser);
  const hasLike = currLikes?.filter(item => item.username === currUser.username);
  
  function toggleLike() {
    if (!hasLike.length) {
      changeLikes([{
        id: currUser.id, 
        username: currUser.username, 
        profilePic: currUser.profilePic
      }, ...currLikes]);
      addLike({userId: currUser.id, postId});
    }
    if (hasLike.length) {
      const newArr = currLikes.filter(item => item.username !== currUser.username);
      changeLikes(newArr);
      removeLike({userId: currUser.id, postId});
    }
  }

  if (isLoadingLikes) {
    return <Loader />
  }

  if (errorLoad || errorAddLike || errorRemoveLike) {
    if (isFetchBaseQueryErrorType(errorLoad)) {
      return <Alert severity="error" sx={{m: 20}}>Произошла ошибка при загрузке данных! {errorLoad.status}</Alert>
    }
  }
  
  return (
    <div className={`${styles.wrapper} ${curTheme ==='darkMode' 
    ? styles['theme-dark'] 
    : styles['theme-light']}`}>
      <div className={`${styles.wrapperIcon} ${counterLikes > 0 ? styles.icon : ''}`}>
        {counterLikes > 0 &&
        <div className={styles.users}>
            <div className={styles.avatars}>
            {currLikes.map((like, index) => {
                if (index <= 4) return (
                <img  
                    key={like.id}
                    className={styles.img} 
                    src={like.profilePic ? like.profilePic : noAvatar} 
                    alt='Фото польз.' 
                />)
                return null;
            })}
            </div>
            {counterLikes === 1 &&
                <span>Нравится {currLikes[0].username}</span>
            }
            {counterLikes > 1 &&
                <span>Нравится {currLikes[0].username} и ещё {counterLikes-1}</span>
            }
        </div>
        }
        <div className={styles.wrapperIcon} onClick={toggleLike}>
        {hasLike.length
           ? <FavoriteOutlinedIcon className={styles.like}/>
           : <FavoriteBorderOutlinedIcon />
        }
        <span className={styles.textLike}>{counterLikes} Нравится</span>
        <span className={styles.mobileInfo}>{counterLikes}</span>
        </div>
      </div>
    </div>
  )
}

export default Likes;
