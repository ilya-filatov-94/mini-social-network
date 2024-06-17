import {FC, memo} from 'react';
import styles from './CardOfActivitiesFriend.module.scss';
import UserAvatar from '../UserAvatar/UserAvatar';
import {useAppSelector} from '../../hooks/useTypedRedux';
import { shallowEqual } from 'react-redux';
import {useGetActivitiesUsersQuery} from '../../services/UserService';
import {FetchBaseQueryError} from "@reduxjs/toolkit/query/react";
import Loader from '../Loader/Loader';
import ErrorOutlineOutlinedIcon from '@mui/icons-material/ErrorOutlineOutlined';


const CardOfActivitiesFriend: FC = memo(()  => {

  const currentTheme = useAppSelector(state => state.reducerTheme.themeMode, shallowEqual);
  const curUserId = useAppSelector(state => state.reducerAuth.currentUser.id, shallowEqual);
  const {
    data: activitiesOfUsers, 
    error, 
    isLoading
  } = useGetActivitiesUsersQuery(curUserId);
  const isFetchBaseQueryErrorType = (error: any): error is FetchBaseQueryError => 'status' in error;

  const getRelativeTimeString = function (date: Date, lang = navigator.language) {
    const time = date.getTime();
    const deltaSeconds = Math.floor((time - Date.now())/1000);
    const offsetTime = [60, 3600, 86400, 86400*7, 86400*30, 86400*365, Infinity];
    const units: Intl.RelativeTimeFormatUnit[] = ['second', 'minute', 'hour', 'day', 'week', 'month', 'year'];
    const unitIndex = offsetTime.findIndex(offsetTime => offsetTime >= Math.abs(deltaSeconds));
    const divisor = unitIndex ? offsetTime[unitIndex-1] : 1;
    const rtf = new Intl.RelativeTimeFormat(lang, {
      numeric: 'always',
      style: 'short',
      localeMatcher: 'best fit'
    });
    return rtf.format(Math.floor(deltaSeconds/divisor), units[unitIndex]);
  } 

  if (isLoading) {
    return <Loader />
  }

  if (error) {
    if (isFetchBaseQueryErrorType(error)) {
      return (
        <div className={styles.isErrorLoading}>
          <div className={styles.MuiAlert}><ErrorOutlineOutlinedIcon/></div>
          <span>Ошибка! {error.status}</span>
        </div>
      )
    }
  }

  if (activitiesOfUsers && activitiesOfUsers?.length === 0) {
    return <p className={styles.emptyActivities}>Нет новостей активности</p>
  }

  return (
    <>
    {(activitiesOfUsers && activitiesOfUsers?.length !== 0) &&
    activitiesOfUsers.map((activity, index) => {
    if (index <= 1) return (
    <div className={styles.user} key={activity.id}>
      <div className={styles.activities}>
        <div>
          <UserAvatar
            addClass={styles.avatar}
            avatar={activity.user.profilePic}
            name={activity.user.username}
            textclass={currentTheme ==='darkMode'
              ? `${styles.textClass} ${styles['theme-dark']}`
              : `${styles.textClass} ${styles['theme-light']}`
            }
            refUser={activity.user.refUser}
            def_size_ico={40}
          />
        </div>
        <p className={currentTheme ==='darkMode'
        ? `${styles.textTimeActivities} ${styles['theme-dark']}`
        : `${styles.textTimeActivities} ${styles['theme-light']}`
        }>{getRelativeTimeString(new Date(activity.createdAt), 'ru')}</p>
      </div>
      <p className={currentTheme ==='darkMode'
          ? `${styles.textActivities} ${styles['theme-dark']}`
          : `${styles.textActivities} ${styles['theme-light']}`
      }>{activity.desc}</p>
      <hr />
    </div>)
    return null;})}
    </>
  );
});

export default CardOfActivitiesFriend;
