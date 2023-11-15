import {FC, useState} from 'react';
import styles from './Friends.module.scss';
import {useAppSelector} from '../../hooks/useTypedRedux';
import ItemUser from './ItemUser/ItemUser';
import {useGetFollowersQuery} from '../../services/UserService';
import {FetchBaseQueryError} from "@reduxjs/toolkit/query/react";
import Loader from '../../components/Loader/Loader';
import Alert from '@mui/material/Alert';
import {IFollower} from '../../types/users';

const Friends: FC = () => {
  const currentTheme = useAppSelector(state => state.reducerTheme.themeMode);
  const currentUser = useAppSelector(state => state.reducerAuth.currentUser);
  const {data: followersData, error, isLoading} = useGetFollowersQuery(currentUser.id);
  const isFetchBaseQueryErrorType = (error: any): error is FetchBaseQueryError => 'status' in error;
  const [selectedItem, setSelecteItem] = useState('all');

  if (isLoading) {
    return <Loader />
  }

  if (error) {
    if (isFetchBaseQueryErrorType(error)) {
      return ( 
      <Alert severity="error" sx={{m: 20}}>
        Произошла ошибка при загрузке данных! {error.status}
      </Alert>);
    }
  }
  
  if (followersData && !error) {
  return (
    <div className={currentTheme ==='darkMode'
        ? `${styles.container} ${styles['theme-dark']}`
        : `${styles.container} ${styles['theme-light']}`
        }>
        <div className={styles.wrapper}>
            <div className={styles.wrapperSelectors}>
                <button className={`${styles.selector} 
                ${selectedItem === 'all' ? styles.active : ''}`}
                  onClick={() => setSelecteItem('all')}
                >Все друзья</button>
                <button className={`${styles.selector} 
                ${selectedItem === 'online' ? styles.active : ''}`}
                  onClick={() => setSelecteItem('online')}
                >Онлайн</button>
                <button className={`${styles.selector} 
                ${selectedItem === 'offline' ? styles.active : ''}`} 
                  onClick={() => setSelecteItem('offline')}
                >Оффлайн</button>
            </div>

            <div className={styles.listUsers}>
            {(followersData && followersData?.length !== 0) &&
                followersData.map((follower: IFollower) => 
                <div key={follower.id} className={styles.wrapperFollowers}>
                  <ItemUser
                    username={follower.username}
                    avatar={follower.profilePic}
                    refUser={follower.refUser}
                    status={follower.status} 
                    city={follower.city}
                  />
                  <hr />
                </div>
                )}
            </div>
        </div>
    </div>
  )
} else return <Alert severity="error" sx={{m: 20}}>{JSON.stringify(error)}</Alert>
}

export default Friends;
