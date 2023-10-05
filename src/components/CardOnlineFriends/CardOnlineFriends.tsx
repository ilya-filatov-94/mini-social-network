import {FC} from 'react';
import styles from './CardOnlineFriends.module.scss';
import UserAvatar from '../UserAvatar/UserAvatar';

interface ISuggestionProps {
  name: string;
  refUser?: string; 
  avatar?: any;
  addClass?: string;
  [key: string]: string | number | undefined;
}

const CardOnlineFriends: FC<ISuggestionProps> = ({
  name, 
  refUser, 
  avatar,
  addClass,
  ...props
}) => {
  return (
    <div className={styles.user} {...props}>
      <div className={styles.userInfo}>
        <UserAvatar
          addClass={styles.avatar}
          avatar={avatar}
          name={name}
          textclass={`${styles.styleText} ${props.textclass}`}
          refUser={name.replaceAll(' ', '')}
          def_size_ico={40}
        />
        <div className={styles.online} />
      </div>
    </div>
  );
}

export default CardOnlineFriends
