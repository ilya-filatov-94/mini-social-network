import {FC, useEffect} from 'react'
import styles from './Profile.module.scss';

import FacebookTwoToneIcon from "@mui/icons-material/FacebookTwoTone";
import LinkedInIcon from "@mui/icons-material/LinkedIn";
import InstagramIcon from "@mui/icons-material/Instagram";
import TwitterIcon from "@mui/icons-material/Twitter";
import PlaceIcon from "@mui/icons-material/Place";
import LanguageIcon from "@mui/icons-material/Language";
import EmailOutlinedIcon from "@mui/icons-material/EmailOutlined";
import MoreVertIcon from "@mui/icons-material/MoreVert";

import Posts from '../../components/Posts/Posts';
import noAvatar from '../../assets/images/no-avatar.jpg';
import { useParams } from "react-router-dom";
import {useAppSelector} from '../../hooks/useTypedRedux';
import {useScroll} from '../../hooks/useScroll';

import coverImage from '../../assets/images/profile-background.jpeg';
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
  // const curUser = useAppSelector(state => state.reducerAuth.currentUser);
  const curUser = profileData[4];

  return (
    <div 
      ref={elRef}
      className={currentTheme ==='darkMode'
      ? `${styles.profile} ${styles['theme-dark']}`
      : `${styles.profile} ${styles['theme-light']}`
      }
    >
      <div className={styles.imagesHeader}>
        <img
          src={coverImage}
          alt={`coverImage of ${curUser.username}`}
          className={styles.cover}
        />
        <img
          src={curUser.profilePic ? curUser.profilePic : noAvatar}
          alt={`avatar of ${curUser.username}`}
          className={styles.profilePic}
        />
      </div>
      <div className={styles.profileContainer}>
      <div className={styles.userInfo}>
          <div className={styles.left}>
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
          <div className={styles.mainInfo}>
            <span className={styles.textNick}>{curUser.username}</span>
            <div className={styles.info}>
              <div className={styles.item}>
                <PlaceIcon />
                <span className={styles.textInfo}>{curUser.city}</span>
              </div>
              <div className={styles.item}>
                <LanguageIcon />
                <span className={styles.textInfo}>{curUser.website}</span>
              </div>
            </div>
            <button className={styles.Btn}>Подписаться</button>
          </div>
          <div className={styles.right}>
            <EmailOutlinedIcon />
            <MoreVertIcon />
          </div>
        </div>
        <Posts posts={posts}/>
      </div>
    </div>
  );
}

export default Profile;
