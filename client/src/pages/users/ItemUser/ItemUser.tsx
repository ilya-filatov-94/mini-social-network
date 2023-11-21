import {FC, useState, useEffect, memo} from 'react';
import styles from './ItemUser.module.scss';
import { Link } from "react-router-dom";
import noAvatar from '../../../assets/images/no-avatar.jpg';
import Button from '../../../components/Button/Button';
import {
  useSubscribeToUserMutation,
  useUnSubscribeToUserMutation
} from '../../../services/UserService';
import Alert from '@mui/material/Alert';
import {FetchBaseQueryError} from "@reduxjs/toolkit/query/react";

interface IUserItemProps {
  myId: number;
  userId: number;
  username: string;
  avatar: string | undefined;
  refUser: string;
  status: string;
  city: string;
  subscrInformation: boolean;
}

const ItemUser: FC<IUserItemProps> = memo(({
    myId,
    userId,
    username, 
    avatar,
    refUser,
    status, 
    city,
    subscrInformation
  }) => {

  const [isFollower, follow] = useState<boolean>(false);
  const [subscribeToUser, {error: errorSubscribe}] = useSubscribeToUserMutation();
  const [unSubscribeToUser, {error: errorUnsubscribe}] = useUnSubscribeToUserMutation();
  const isFetchBaseQueryErrorType = (error: any): error is FetchBaseQueryError => 'status' in error;

  useEffect(() => {
    if (userId) {
      follow(subscrInformation);
    }
  // eslint-disable-next-line
  }, [subscrInformation]);

  async function subscribe(subscribeTo: boolean) {
    follow(!subscribeTo);
    if (!subscribeTo) {
      await subscribeToUser({curUserId: myId, followerId: userId}).unwrap();
    }
    if (subscribeTo) {
      await unSubscribeToUser({curUserId: myId, followerId: userId}).unwrap();
    }
  }

  if (errorSubscribe || errorUnsubscribe) {
    if (isFetchBaseQueryErrorType(errorSubscribe)) {
      return <Alert severity="error" sx={{m: 20}}>Произошла ошибка при загрузке данных! {errorSubscribe.status}</Alert>
    }
    if (isFetchBaseQueryErrorType(errorUnsubscribe)) {
      return <Alert severity="error" sx={{m: 20}}>Произошла ошибка при загрузке данных! {errorUnsubscribe.status}</Alert>
    }
  }

  return (
    <div className={styles.userItem}>
      <img
        className={styles.avatar}
        src={avatar ? avatar : noAvatar}
        alt={`${username} avatar`}
      />
      <div className={styles.infoUser}>
        <Link className={styles.link} to={`/profile/${refUser}?id=${myId}`}>
          <p className={styles.username}>{username}</p>
        </Link>
        <p className={styles.infoText}>{status}</p>
        <p className={styles.infoText}>город: {city}</p>
        <Button 
          onClick={() => subscribe(isFollower)}
          addClass={isFollower ? styles.dismissBtn : styles.followBtn}
        >{isFollower ? 'Отписаться' : 'Подписаться'}</Button>
      </div>
    </div>
  )
})

export default ItemUser;
