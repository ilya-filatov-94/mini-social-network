import {FC} from 'react';
import styles from './ItemUser.module.scss';
import { Link } from "react-router-dom";
import noAvatar from '../../../assets/images/no-avatar.jpg';

interface IUserItemProps {
    id?: number;
    username: string;
    avatar: string | undefined;
    refUser: string;
    status: string;
    city: string;
}

const ItemUser: FC<IUserItemProps> = ({
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
        src={avatar ? avatar : noAvatar}
        alt={`${username} avatar`}
      />
      <div className={styles.infoUser}>
        <Link className={styles.link} to={`/profile/${refUser}`}>
            <p className={styles.username}>{username}</p>
        </Link>
        <p className={styles.infoText}>{status}</p>
        <p className={styles.infoText}>{city}</p>
      </div>
    </div>
  );
}

export default ItemUser;
