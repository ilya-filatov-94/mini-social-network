import {FC} from 'react';
import styles from './CardOfActivitiesFriend.module.scss';
import UserAvatar from '../UserAvatar/UserAvatar';
import {useAppSelector} from '../../hooks/useTypedRedux';

interface IActivitiesProps {
  name: string; 
  refUser?: string;
  avatar?: any;
  textEvent: string;
  timeEvent: string;
  addClass?: string;
  [key: string]: string | number | undefined;
}

const CardOfActivitiesFriend: FC<IActivitiesProps> = ({
  name, 
  refUser, 
  avatar, 
  textEvent, 
  timeEvent,
  addClass,
  ...props
}) => {

  const currentTheme = useAppSelector(state => state.reducerTheme.themeMode);

  return (
    <div className={styles.user} {...props}>
      <div className={styles.activities}>
        <div>
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
        </div>
        <p className={currentTheme ==='darkMode'
          ? `${styles.textActivities} ${styles['theme-dark']}`
          : `${styles.textActivities} ${styles['theme-light']}`
        }>{textEvent}</p>
      </div>
      <p className={currentTheme ==='darkMode'
        ? `${styles.textTimeActivities} ${styles['theme-dark']}`
        : `${styles.textTimeActivities} ${styles['theme-light']}`
      }>{timeEvent}</p>
    </div>
  );
}

export default CardOfActivitiesFriend;
