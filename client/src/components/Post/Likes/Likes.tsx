import {FC, useState, useEffect, useCallback} from 'react';
import styles from './Likes.module.scss';
import {useAppSelector} from '../../../hooks/useTypedRedux';
import { shallowEqual } from 'react-redux';
import {FavoriteOutlined, FavoriteBorderOutlined} from "@mui/icons-material";
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
import {Link} from 'react-router-dom';
import TemplatePopup from '../../TemplatePopup/TemplatePopup';

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
  const [isVisiblePopup, setVisiblePopup] = useState<boolean>(false);

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

  const renderContentPopup = useCallback((likers: ILikes[] | undefined) => {
    return (
      <div className={styles.wrapperUsers}>
      {(!!likers && likers?.length > 0) &&
      likers.map((user: ILikes) => (
      <div key={user.id} className={styles.infoUser}>
          <img
              className={styles.avatar}
              src={user.profilePic ? (urlAPIimages + user.profilePic) : noAvatar}
              alt={`${user.username} avatar`}
          />
          <div className={styles.info}>
              <Link className={styles.link} to={`/profile/${user.refUser}?id=${user.refUser}`}>
                  <p className={styles.username}>{user.username}</p>
              </Link>
          </div>
      </div>))}
      </div>
    )
  }, []);
  
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
            <div className={styles.users} onClick={() => setVisiblePopup(true)}>
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
            ? <FavoriteOutlined className={styles.like}/>
            : <FavoriteBorderOutlined />
            }
            <p className={styles.textLike}>{counterLikes} Нравится</p>
            <p className={styles.mobileInfo}>{counterLikes}</p>
          </div>
      </div>
      <TemplatePopup 
          isVisible={isVisiblePopup} 
          setVisible={setVisiblePopup}
          headerPopup={`Понравилось ${counterLikes} людям`}
          contentPopup={renderContentPopup(currLikes)}
      />
    </div>
  )
}

export default Likes;
