import {FC} from 'react';
import styles from './UserActivity.module.scss';
import {useAppSelector} from '../../hooks/useTypedRedux';

const UserActivity: FC = () => {

  const currentTheme = useAppSelector(state => state.reducerTheme.themeMode);

  return (
    <div className={currentTheme ==='darkMode'
        ? `${styles.container} ${styles['theme-dark']}`
        : `${styles.container} ${styles['theme-light']}`
        }>
        <div className={styles.wrapper}>
            <h2 className={styles.header}>Активность друзей</h2>
        </div>
        <div className={styles.wrapper}>
          <p>Активности отсутствуют</p>
        </div>
    </div>
  )
}

export default UserActivity;
