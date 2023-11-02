import {FC, useEffect} from 'react'
import styles from './Profile.module.scss';

import FacebookTwoToneIcon from "@mui/icons-material/FacebookTwoTone";
import LinkedInIcon from "@mui/icons-material/LinkedIn";
import InstagramIcon from "@mui/icons-material/Instagram";
import TwitterIcon from "@mui/icons-material/Twitter";
import PlaceIcon from "@mui/icons-material/Place";
import LanguageIcon from "@mui/icons-material/Language";

import Posts from '../../components/Posts/Posts';
import SharePost from '../../components/SharePost/SharePost';
import noAvatar from '../../assets/images/no-avatar.jpg';
import { useParams } from "react-router-dom";
import {useAppSelector} from '../../hooks/useTypedRedux';
import {useScroll} from '../../hooks/useScroll';


import { posts } from './temporaryDataProfile';
import {profileData} from './temporaryDataProfile';

const Profile: FC = () => {
  const {id} = useParams();

  const [executeScroll, elRef] = useScroll();
  useEffect(() => {
    executeScroll();
  // eslint-disable-next-line
  }, [id]);

  const currentTheme = useAppSelector(state => state.reducerTheme.themeMode);
  const curUser = useAppSelector(state => state.reducerAuth.currentUser);

  const userData = profileData.filter(user => user.refUser === id)[0];

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
            src={userData.coverPic}
            alt={`coverImage of ${userData.username}`}
            className={styles.cover}
          />
        : <div className={styles.bgNonCover}/>
        }
        {/* <img
          src={userData.coverPic}
          alt={`coverImage of ${userData.username}`}
          className={styles.cover}
        /> */}
        <img
          src={userData.profilePic ? userData.profilePic : noAvatar}
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
              {id !== curUser.refUser
              ? <>
                  <button className={styles.Btn}>Написать</button>
                  <button className={styles.Btn}>Подписаться</button>
                </>
              : <button className={styles.Btn}>Редактировать профиль</button>
              }
            </div>
          </div>
        </div>
        <SharePost userId={curUser.id}/>
        <Posts posts={posts}/>
      </div>
    </div>
  );
}

export default Profile;
