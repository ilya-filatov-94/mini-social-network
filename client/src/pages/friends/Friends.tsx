import {FC} from 'react';
import styles from './Friends.module.scss';
import {useAppSelector} from '../../hooks/useTypedRedux';

const Friends: FC = () => {
  const currentTheme = useAppSelector(state => state.reducerTheme.themeMode);
  const currentUser = useAppSelector(state => state.reducerAuth.currentUser);
//   const {data: userData, error: errorLoading, isLoading: isLoadingData} = useGetUserDataQuery(ref);

  console.log(currentUser);
    

  return (
    <div className={currentTheme ==='darkMode'
        ? `${styles.container} ${styles['theme-dark']}`
        : `${styles.container} ${styles['theme-light']}`
        }>
        <div className={styles.wrapper}>

        </div>
    </div>
  )
}

export default Friends;
