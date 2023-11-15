import {FC, useEffect} from 'react'
import styles from './Profile.module.scss';

import {urlAPIimages} from '../../env_variables'; 
import {useGetUserProfileQuery} from '../../services/UserService';
import { useParams } from "react-router-dom";
import {useAppSelector} from '../../hooks/useTypedRedux';
import {useScroll} from '../../hooks/useScroll';
import { 
  FetchBaseQueryError,
} from "@reduxjs/toolkit/query/react";
import Loader from '../../components/Loader/Loader';
import Alert from '@mui/material/Alert';
import Posts from '../../components/Posts/Posts';
import SharePost from '../../components/SharePost/SharePost';
import ButtonLink from '../../components/ButtonLink/ButtonLink';
import noAvatar from '../../assets/images/no-avatar.jpg';
import FacebookTwoToneIcon from "@mui/icons-material/FacebookTwoTone";
import LinkedInIcon from "@mui/icons-material/LinkedIn";
import InstagramIcon from "@mui/icons-material/Instagram";
import TwitterIcon from "@mui/icons-material/Twitter";
import PlaceIcon from "@mui/icons-material/Place";
import LanguageIcon from "@mui/icons-material/Language";


const Profile: FC = () => {
  const {id} = useParams();
  const {data: userData, error, isLoading} = useGetUserProfileQuery(id as string, {skip: !id});
  const isFetchBaseQueryErrorType = (error: any): error is FetchBaseQueryError => 'status' in error;

  const currentTheme = useAppSelector(state => state.reducerTheme.themeMode);
  const curUser = useAppSelector(state => state.reducerAuth.currentUser);
  const currentUser = curUser.refUser === id;

  const [executeScroll, elRef] = useScroll();
  useEffect(() => {
    executeScroll();
  // eslint-disable-next-line
  }, [id]);
  
  if (isLoading) {
    return <Loader />
  }

  if (error) {
    if (isFetchBaseQueryErrorType(error)) {
      return <Alert severity="error" sx={{m: 20}}>Произошла ошибка при загрузке данных! {error.status}</Alert>
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
                <span className={styles.textInfo}>{userData.city}</span>
              </div>
              <div className={styles.item}>
                <LanguageIcon />
                <span className={styles.textInfo}>{userData.website}</span>
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
                  <button className={styles.Btn}>Подписаться</button>
                </>
                : <ButtonLink addClass={styles.Btn} to={`/profile/${id}/edit`}>
                    Редактировать профиль
                  </ButtonLink>
              }
            </div>
          </div>
        </div>
        {currentUser && <SharePost userId={userData.id} />}
        <Posts userId={userData.id} currentUser={currentUser} />
      </div>
    </div>
  );
} else return <Alert severity="error" sx={{m: 20}}>{JSON.stringify(error)}</Alert>
}

export default Profile;
