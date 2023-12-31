import {FC, memo} from 'react';
import styles from './ItemUser.module.scss';
import { Link } from "react-router-dom";
import noAvatar from '../../../assets/images/no-avatar.jpg';
import {urlAPIimages} from '../../../env_variables';

interface IUserItemProps {
  id?: number;
  curUserId: number;
  username: string;
  avatar: string | undefined;
  refUser: string;
  status: string;
  city: string;
}

const ItemUser: FC<IUserItemProps> = memo(({
  curUserId,
  username, 
  avatar,
  refUser,
  status, 
  city
}) => {
  return (
    <div className={styles.userItem}>
      <img
        className={styles.avatar}
        src={avatar ? urlAPIimages + avatar : noAvatar}
        alt={`${username} avatar`}
      />
      <div className={styles.infoUser}>
        <Link className={styles.link} to={`/profile/${refUser}?id=${curUserId}`}>
          <p className={styles.username}>{username}</p>
        </Link>
        <p className={styles.infoText}>{status}</p>
        <p className={styles.infoText}>{city}</p>
      </div>
    </div>
  );
})

export default ItemUser;
