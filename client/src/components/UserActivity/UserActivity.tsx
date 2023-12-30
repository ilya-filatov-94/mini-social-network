import {FC, memo} from 'react';
import styles from './UserActivity.module.scss';
import {useAppSelector} from '../../hooks/useTypedRedux';
import { shallowEqual } from 'react-redux';
import { Link } from 'react-router-dom';
import noAvatar from '../../assets/images/no-avatar.jpg';
import {urlAPIimages} from '../../env_variables';
import {getRelativeTimeString} from '../../helpers/dateTimeFormatting';
import {useGetActivitiesUsersQuery} from '../../services/UserService';
import {FetchBaseQueryError} from "@reduxjs/toolkit/query/react";
import Loader from '../Loader/Loader';
import ErrorOutlineOutlinedIcon from '@mui/icons-material/ErrorOutlineOutlined';


const UserActivity: FC = memo(() => {

  const currentTheme = useAppSelector(state => state.reducerTheme.themeMode, shallowEqual);
  const curUserId = useAppSelector(state => state.reducerAuth.currentUser.id, shallowEqual);
  const {
    data: activitiesOfUsers, 
    error, 
    isLoading
  } = useGetActivitiesUsersQuery(curUserId);
  const isFetchBaseQueryErrorType = (error: any): error is FetchBaseQueryError => 'status' in error;

  if (isLoading) {
    return <Loader />
  }

  if (error) {
    if (isFetchBaseQueryErrorType(error)) {
      return (
        <div className={styles.isErrorLoading}>
          <div className={styles.MuiAlert}><ErrorOutlineOutlinedIcon/></div>
          <span>Произошла ошибка при загрузке данных! {error.status}</span>
        </div>
      )
    }
  }

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

      {(activitiesOfUsers && activitiesOfUsers.length === 0) &&
      <div className={styles.wrapper}>
        <p>Активности отсутствуют</p>
      </div>}

      {(activitiesOfUsers && activitiesOfUsers.length !== 0) &&
      activitiesOfUsers.map((activity) => (
      <div className={styles.wrapper} key={activity.id}>
        <div className={styles.activityInfo}>
          <div className={styles.userInfo}>
            <img
              className={styles.avatar}
              src={
                activity.profilePic
                ? urlAPIimages + activity.profilePic
                : noAvatar
              }
              alt={`post ${activity.id} photо`}
            />
            <div className={styles.details}>
              <Link
                className={styles.link}
                to={`/profile/${activity.refUser}?id=${16}`}
                replace={true}
              ><span className={styles.username}>{activity.username}</span>
              </Link>
              <p>{activity.desc}</p>
            </div>
          </div>
          <p className={styles.date}>
            {getRelativeTimeString(
              new Date(activity.createdAt),
              "ru"
            )}
          </p>
        </div>
        {(activity.text || activity.image) &&
        <div className={styles.activityContent}>
          {activity.text && <p>{activity.text}</p>}
          {activity.image &&
          <img 
            className={`${styles.imgPost} 
              ${activity.text ? styles.notEmpty : ''}`
            }
            src={urlAPIimages + activity.image}
            alt={`activity of ${activity.username}`} 
          />}
        </div>}
      </div>))}

    </div>
  );
});

export default UserActivity;
