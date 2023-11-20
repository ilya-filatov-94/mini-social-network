import {FC} from 'react';
import styles from './ItemUser.module.scss';
import { Link } from "react-router-dom";
import noAvatar from '../../../assets/images/no-avatar.jpg';
import Button from '../.././../components/Button/Button';

interface IUserItemProps {
    id?: number;
    username: string;
    avatar: string | undefined;
    refUser: string;
    status: string;
    city: string;
    subscrInformation: boolean;
}

const ItemUser: FC<IUserItemProps> = ({
    username, 
    avatar,
    refUser,
    status, 
    city,
    subscrInformation
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
        {subscrInformation 
        ? <Button addClass={styles.dismissBtn}>Отписаться</Button>
        : <Button addClass={styles.followBtn}>Подписаться</Button>
        }
      </div>
    </div>
  )
}

export default ItemUser;
