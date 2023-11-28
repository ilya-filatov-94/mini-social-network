import {FC} from 'react';
import styles from './UserActivity.module.scss';
import {useAppSelector} from '../../hooks/useTypedRedux';
import { Link } from 'react-router-dom';
import noAvatar from '../../assets/images/no-avatar.jpg';
import {urlAPIimages} from '../../env_variables';
import {getRelativeTimeString} from '../../helpers/dateTimeFormatting';


import {
  activitiesOfFriends,
} from '../RightBar/arraysOfActivities';

const UserActivity: FC = () => {

  const currentTheme = useAppSelector(state => state.reducerTheme.themeMode);

  return (
    <div
      className={
        currentTheme === "darkMode"
          ? `${styles.container} ${styles["theme-dark"]}`
          : `${styles.container} ${styles["theme-light"]}`
      }
    >
      <div className={styles.wrapper}>
        <h2 className={styles.header}>Активность друзей</h2>
      </div>

      <div className={styles.wrapper}>
        <p>Активности отсутствуют</p>
      </div>


      <div className={styles.wrapper}>
        <div className={styles.activityInfo}>
          <div className={styles.userInfo}>
            <img
              className={styles.avatar}
              src={
              activitiesOfFriends[0].profilePic
                ? urlAPIimages + activitiesOfFriends[0].profilePic
                : noAvatar
              }
              alt={`post ${activitiesOfFriends[0].id} photо`}
            />
            <div className={styles.details}>
              <Link
                className={styles.link}
                to={`/profile/${activitiesOfFriends[0].refUser}?id=${16}`}
                replace={true}
              ><span className={styles.username}>{activitiesOfFriends[0].username}</span>
              </Link>
              <p>{activitiesOfFriends[1].desc}</p>
            </div>
          </div>
          <p className={styles.date}>
            {getRelativeTimeString(
              new Date("2023-11-27T19:12:46.304Z"),
              "ru"
            )}
          </p>
        </div>
        <div className={styles.activityContent}>
          {activitiesOfFriends[1].content && <p>{activitiesOfFriends[1].content}</p>}
          {activitiesOfFriends[0].image &&
          <img 
            className={`${styles.imgPost} 
              ${activitiesOfFriends[0].content ? styles.notEmpty : ''}`
            }
            src={activitiesOfFriends[0].image} 
            alt={`activity of ${activitiesOfFriends[0].username}`} 
          />}
        </div>
      </div>

    </div>
  );
}

export default UserActivity;
