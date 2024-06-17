import {FC, useState, useEffect} from 'react';
import styles from './Likes.module.scss';
import {useAppSelector} from '../../../hooks/useTypedRedux';
import { shallowEqual } from 'react-redux';
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
import AlertWidget from '../../AlertWidget/AlertWidget';
import {FetchBaseQueryError} from "@reduxjs/toolkit/query/react";
import {urlAPIimages} from '../../../env_variables';

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

  const counterLikes = currLikes.length;
  const currUser = useAppSelector(state => state.reducerAuth.currentUser, shallowEqual);
  const hasLike = currLikes?.filter(item => item.username === currUser.username).length;
  
  useEffect(() => {
    if (likes?.length) {
      const currUserLike = likes.filter(item => item.username === currUser.username);
      const otherLikes = likes.filter(item => item.username !== currUser.username);
      changeLikes([...currUserLike, ...otherLikes]);
    }
  }, [likes, currUser.username]);
  
  async function toggleLike() {
    const curUserLike = {
      id: currUser.id,  //т.к. userId уникален для массива лайков (дважды лайк поставить нельзя)
      userId: currUser.id,
      postId,
      username: currUser.username, 
      profilePic: currUser.profilePic,
      refUser: currUser.refUser
    }
    if (!hasLike) {
      changeLikes([curUserLike, ...currLikes]);
      await addLike(curUserLike).unwrap();
    }
    if (hasLike) {
      const newArrlikes = currLikes.filter(item => item.username !== currUser.username);
      changeLikes(newArrlikes);
      await removeLike(curUserLike).unwrap();
    }
  }

  if (isLoadingLikes) {
    return <Loader />
  }

  if (errorLoad || errorAddLike || errorRemoveLike) {
    if (isFetchBaseQueryErrorType(errorLoad)) {
      return (
        <AlertWidget
          error={errorLoad} 
          errorMessage='Ошибка загрузки лайков!'
        />
      )
    }
    if (isFetchBaseQueryErrorType(errorAddLike)) {
      return (
      <AlertWidget
        error={errorAddLike} 
        errorMessage='Ошибка добавления лайка!'
      />)
    }
    if (isFetchBaseQueryErrorType(errorRemoveLike)) {
      return (
        <AlertWidget
          error={errorRemoveLike} 
          errorMessage='Ошибка отмены лайка!'
        />)
    }
  }
  
  return (
    <div className={`${styles.wrapper} ${curTheme ==='darkMode' 
    ? styles['theme-dark'] 
    : styles['theme-light']}`}>
      <div className={styles.wrapperIcon}>
          {counterLikes > 0 &&
            <div className={styles.users} onClick={() => console.log('Открытие окна с лайками')}>
              <div className={styles.avatars}>
              {currLikes.map((like, index) => {
                if (index <= 4) return (
                <img  
                    key={like.id}
                    className={styles.img} 
                    src={like.profilePic ? (urlAPIimages + like.profilePic) : noAvatar} 
                    alt='Фото польз.' 
                />)
                return null;
              })}
              </div>
              {counterLikes === 1 &&
                <p>Нравится {currLikes[0].username}</p>
              }
              {counterLikes > 1 &&
                <p>Нравится {currLikes[0].username} и ещё {counterLikes-1}</p>
              }
            </div>
          }
          <div className={styles.infoLike} onClick={toggleLike}>
            {hasLike
            ? <FavoriteOutlinedIcon className={styles.like}/>
            : <FavoriteBorderOutlinedIcon />
            }
            <p className={styles.textLike}>{counterLikes} Нравится</p>
            <p className={styles.mobileInfo}>{counterLikes}</p>
          </div>
      </div>
    </div>
  )
}

export default Likes;
