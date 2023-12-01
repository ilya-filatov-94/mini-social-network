import {FC, memo} from 'react';
import styles from './UserAvatar.module.scss';
import noAvatar from '../../assets/images/no-avatar.jpg';
import { Link } from 'react-router-dom';
import {useAppSelector} from '../../hooks/useTypedRedux';
import {urlAPIimages} from '../../env_variables';


interface IUserAvatarProps {
  avatar?: string | undefined; 
  name: string;
  refUser?: string; 
  addClass?: string;
  [key: string]: string | number | (() => void) | undefined;
}

const UserAvatar: FC<IUserAvatarProps> = memo(({
  avatar, 
  name, 
  refUser, 
  addClass,
  ...props
}) => {

  const currentUser = useAppSelector(state => state.reducerAuth.currentUser);

  const usernameLink = (
    <Link 
      className={`${styles.styleText} ${props.textclass}`} 
      to={currentUser.refUser === refUser 
        ? `/profile/${refUser}` 
        : `/profile/${refUser}?id=${currentUser.id}`}
    >
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
        src={avatar ? urlAPIimages + avatar : noAvatar} 
        alt={`${name} user`} 
        className={addClass}
      />
      {refUser
        ? usernameLink
        : usernameWithoutLink
      }
    </div>
  )
});

export default UserAvatar
