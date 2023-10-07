import {FC} from 'react';
import styles from './CardOfSuggestionFriend.module.scss';
import UserAvatar from '../UserAvatar/UserAvatar';
import Button from '../Button/Button';
import {useAppSelector} from '../../hooks/useTypedRedux';

interface ISuggestionProps {
  name: string;
  refUser?: string; 
  avatar?: string | undefined;
  addClass?: string;
  [key: string]: string | number | undefined;
}

const CardOfSuggestionFriend: FC<ISuggestionProps> = ({
  name, 
  refUser, 
  avatar,
  addClass,
  ...props
}) => {

  const currentTheme = useAppSelector(state => state.reducerTheme.themeMode);

  return (
    <div className={styles.user} {...props}>
      <UserAvatar
        addClass={styles.avatar}
        avatar={avatar}
        name={name}
        textclass={currentTheme ==='darkMode'
          ? `${styles.textClass} ${styles['theme-dark']}`
          : `${styles.textClass} ${styles['theme-light']}`
        }
        refUser={name.replaceAll(' ', '')}
        def_size_ico={40}
      />
      <div className={styles.buttons}>
        <Button addClass={styles.followBtn}>Подписаться</Button>
        <Button addClass={styles.dismissBtn}>Отписаться</Button>
      </div>
    </div>
  );
}

export default CardOfSuggestionFriend;
