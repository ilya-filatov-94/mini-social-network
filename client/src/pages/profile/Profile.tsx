import {FC, useEffect, useState} from 'react'
import styles from './Profile.module.scss';

import {urlAPIimages} from '../../env_variables'; 
import {
  useGetUserProfileQuery,
  useSubscribeToUserMutation,
  useUnSubscribeToUserMutation
} from '../../services/UserService';
import {useParams} from "react-router-dom";
import {useAppSelector} from '../../hooks/useTypedRedux';
import { shallowEqual } from 'react-redux';
import {useScroll} from '../../hooks/useScroll';
import {FetchBaseQueryError} from "@reduxjs/toolkit/query/react";
import Loader from '../../components/Loader/Loader';
import Alert from '@mui/material/Alert';
import Posts from '../../components/Posts/Posts';
import SharePost from '../../components/SharePost/SharePost';
import ButtonLink from '../../components/ButtonLink/ButtonLink';
import Button from '../../components/Button/Button';
import noAvatar from '../../assets/images/no-avatar.jpg';
import {
  FacebookTwoTone as FacebookTwoToneIcon,
  LinkedIn as LinkedInIcon,
  Instagram as InstagramIcon,
  Twitter as TwitterIcon,
  Place as PlaceIcon,
  Language as LanguageIcon,
} from "@mui/icons-material";


const Profile: FC = () => {
  const {id} = useParams();
  const curUser = useAppSelector(state => state.reducerAuth.currentUser, shallowEqual);
  const currentUser = curUser.refUser === id;
  const {data: userData, error, isLoading} = useGetUserProfileQuery({
    ref: id as string, id: curUser.id}, {skip: (!id || !curUser.id)});
  const [isFollower, follow] = useState<boolean>(false);
  const [subscribeToUser, {error: errorSubscribe}] = useSubscribeToUserMutation();
  const [unSubscribeToUser, {error: errorUnsubscribe}] = useUnSubscribeToUserMutation();
  const isFetchBaseQueryErrorType = (error: any): error is FetchBaseQueryError => 'status' in error;

  const currentTheme = useAppSelector(state => state.reducerTheme.themeMode, shallowEqual);

  const [executeScroll, elRef] = useScroll('start');
  useEffect(() => {
    executeScroll();
  }, [id, executeScroll]);

  useEffect(() => {
    if (!currentUser) {
      follow(userData?.isSubscriber!); 
    }
  // eslint-disable-next-line
  }, [userData]);

  async function subscribe(subscribeTo: boolean) {
    if (userData) {
      follow(!subscribeTo);
      if (!subscribeTo) {
        await subscribeToUser({
          curUserId: curUser.id,
          followerId: userData?.id,
        }).unwrap();
      }
      if (subscribeTo) {
        await unSubscribeToUser({
          curUserId: curUser.id,
          followerId: userData?.id,
        }).unwrap();
      }
    }
  }
  
  if (isLoading) {
    return <Loader />
  }

  if (error || errorSubscribe || errorUnsubscribe) {
    if (isFetchBaseQueryErrorType(error)) {
      return <Alert severity="error" sx={{m: 20}}>Произошла ошибка при загрузке данных! {error.status}</Alert>
    }
    if (isFetchBaseQueryErrorType(errorSubscribe)) {
      return <Alert severity="error" sx={{m: 20}}>Произошла ошибка при загрузке данных! {errorSubscribe.status}</Alert>
    }
    if (isFetchBaseQueryErrorType(errorUnsubscribe)) {
      return <Alert severity="error" sx={{m: 20}}>Произошла ошибка при загрузке данных! {errorUnsubscribe.status}</Alert>
    }
  }

  if (userData && !error) {
  return (
    <div 
      ref={elRef}
      className={currentTheme ==='darkMode'
      ? `${styles.profile} ${styles['theme-dark']}`
      : `${styles.profile} ${styles['theme-light']}`
      }
    >
      <div className={styles.imagesHeader}>
        {userData.coverPic 
        ? <img
            src={urlAPIimages + userData.coverPic}
            alt={`coverImage of ${userData.username}`}
            className={styles.cover}
          />
        : <div className={styles.bgNonCover}/>
        }
        <img
          src={userData.profilePic ? urlAPIimages + userData.profilePic : noAvatar}
          alt={`avatar of ${userData.username}`}
          className={styles.profilePic}
        />
      </div>
      <div className={styles.profileContainer}>
      <div className={styles.userInfo}>
          <div className={styles.mainInfo}>
            <span className={styles.textNick}>{userData.username}</span>
            <div className={styles.info}>
              <div className={styles.item}>
                <PlaceIcon />
                <span className={styles.textInfo}>город: {userData.city}</span>
              </div>
              <div className={styles.item}>
                <LanguageIcon />
                <span className={styles.textInfo}>сайт: {userData.website}</span>
              </div>
            </div>
            <div className={styles.socials}>
              <a href="http://facebook.com">
                <FacebookTwoToneIcon />
              </a>
              <a href="http://instagram.com">
                <InstagramIcon />
              </a>
              <a href="http://twitter.com">
                <TwitterIcon />
              </a>
              <a href="http://ru.linkedinn.com">
                <LinkedInIcon />
              </a>
            </div>
            <div className={styles.userActions}>
              {!currentUser
              ? <>
                  <button className={styles.Btn}>Написать</button>
                  <Button 
                    onClick={() => subscribe(isFollower)}
                    addClass={isFollower ? `${styles.Btn} ${styles.dismissBtn}` : styles.Btn}
                  >{isFollower ? 'Отписаться' : 'Подписаться'}</Button>
                </>
                : <ButtonLink addClass={styles.Btn} to={`/profile/${id}/edit`}>
                    Редактировать профиль
                  </ButtonLink>
              }
            </div>
          </div>
        </div>
        {currentUser && <SharePost userId={userData.id} />}
        <Posts userId={userData.id} currentUser={currentUser} curUserId={curUser.id}/>
      </div>
    </div>
  );
} else return <Alert severity="error" sx={{m: 20}}>{JSON.stringify(error)}</Alert>
}

export default Profile;
