import {FC} from 'react';
import styles from './UserAvatar.module.scss';
import noAvatar from '../../assets/images/no-avatar.jpg';
import { Link } from 'react-router-dom';


interface IUserAvatarProps {
  avatar?: any; 
  name: string;
  refUser?: string; 
  addClass?: string;
  [key: string]: string | number | (() => void) | undefined;
}

const UserAvatar: FC<IUserAvatarProps> = ({
  avatar, 
  name, 
  refUser, 
  addClass,
  ...props
}) => {

  const usernameLink = (
    <Link className={`${styles.styleText} ${props.textclass}`} to={`/profile/${refUser}`}>
        <span>{name}</span>
    </Link>
  );

  const usernameWithoutLink = (
    <span className={`${styles.styleText} ${props.textclass}`}>{name}</span>
  );

  return (
    <div {...props} className={props.tabletmode
      ? `${styles.userAvatar} ${props.tabletmode}`
      :   styles.userAvatar
      }>
      <img 
        src={avatar ? avatar : noAvatar} 
        alt={`${name} user`} 
        className={addClass}
      />
      {refUser
        ? usernameLink
        : usernameWithoutLink
      }
    </div>
  )
}

export default UserAvatar
