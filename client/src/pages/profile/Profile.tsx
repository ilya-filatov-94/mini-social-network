import {FC, useEffect, useState} from 'react'
import styles from './Profile.module.scss';

import {urlAPIimages} from '../../env_variables'; 
import {
  useGetUserProfileQuery,
  useSubscribeToUserMutation,
  useUnSubscribeToUserMutation
} from '../../services/UserService';
import {useOpenConversationMutation} from '../../services/MessengerService';
import {useParams, useNavigate} from "react-router-dom";
import {useAppSelector} from '../../hooks/useTypedRedux';
import { setCurrentConversationData } from '../../store/conversationSlice';
import { shallowEqual } from 'react-redux';
import {useScroll} from '../../hooks/useScroll';
import {FetchBaseQueryError} from "@reduxjs/toolkit/query/react";
import {useAppDispatch} from '../../hooks/useTypedRedux';
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
import {useMatchMedia} from '../../hooks/useMatchMedia';
import {IConversation} from '../../types/messenger';


const Profile: FC = () => {
  const {id} = useParams();
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const curUser = useAppSelector(state => state.reducerAuth.currentUser, shallowEqual);
  const currentUser = curUser.refUser === id;
  const {data: userData, error, isLoading} = useGetUserProfileQuery({
    ref: id as string, id: curUser.id}, {skip: (!id || !curUser.id)});
  const [isFollower, follow] = useState<boolean>(false);
  const [subscribeToUser, {error: errorSubscribe}] = useSubscribeToUserMutation();
  const [unSubscribeToUser, {error: errorUnsubscribe}] = useUnSubscribeToUserMutation();
  const [openConversation, {
    isError: isErrorOpenConversation, 
    isLoading: isLoadingOpenConversation
  }] = useOpenConversationMutation();
  const isFetchBaseQueryErrorType = (error: any): error is FetchBaseQueryError => 'status' in error;

  const currentTheme = useAppSelector(state => state.reducerTheme.themeMode, shallowEqual);
  const {isMobile} = useMatchMedia();

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

  function navigateToMessenger() {
    openConversation({
      userId: curUser.id, 
      memberId: (userData!).id
    })
    .unwrap()
    .then((conversationData: IConversation) => {  
      dispatch(setCurrentConversationData({
        id: conversationData.id,
        memberId: conversationData.memberId,
        lastMessageId: conversationData.lastMessageId,
        lastMessageText: conversationData.lastMessageText,
        username: conversationData.username,
        profilePic: conversationData.profilePic,
        refUser: conversationData.refUser,
        status: conversationData.status
      }));
      navigate(`/messages/${conversationData.id}`);
    })
    .catch((error: unknown) => {
        if (isFetchBaseQueryErrorType(error)) {
          console.error(error);
        }
    });
  }

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
  
  if (isLoading || isLoadingOpenConversation) {
    return <Loader />
  }

  if (error || errorSubscribe || errorUnsubscribe || isErrorOpenConversation) {
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
      <div className={styles.wrapper}>
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
                <span className={styles.textInfo}>
                  {!isMobile ? 'город: ' + userData.city : userData.city}
                </span>
              </div>
              <div className={styles.item}>
                <LanguageIcon />
                <span className={styles.textInfo}>
                  {!isMobile ? 'сайт: ' + userData.website : userData.website}
                </span>
              </div>
              {(userData?.facebook !=='' || userData?.instagram !=='' || userData?.twitter !=='' || userData?.linkedinn !=='') && (
              <>
                <div className={styles.item}>
                  <span className={styles.textInfo}>Социальные сети: </span>
                </div>
                <div className={styles.item}>
                  <div className={styles.socials}>
                    {userData?.facebook && (
                    <a href={userData?.facebook}>
                      <FacebookTwoToneIcon />
                    </a>)}
                    {userData?.instagram && (
                    <a href={userData?.instagram}>
                      <InstagramIcon />
                    </a>)}
                    {userData?.twitter && (
                    <a href={userData?.twitter}>
                        <TwitterIcon />
                    </a>)}
                    {userData?.linkedinn && (
                    <a href={userData?.linkedinn}>
                      <LinkedInIcon />
                    </a>)}
                  </div>
                </div>
              </>)}
            </div>
            <div className={styles.userActions}>
              {!currentUser
              ? <>
                  <Button addClass={styles.btn} onClick={navigateToMessenger}>Написать</Button>
                  <Button 
                    onClick={() => subscribe(isFollower)}
                    addClass={isFollower ? `${styles.btn} ${styles.dismissBtn}` : styles.btn}
                  >{isFollower ? 'Отписаться' : 'Подписаться'}</Button>
                </>
                : <ButtonLink addClass={styles.btn} to={`/profile/${id}/edit`}>
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
    </div>
  );
} else return <Alert severity="error" sx={{m: 20}}>{JSON.stringify(error)}</Alert>
}

export default Profile;
