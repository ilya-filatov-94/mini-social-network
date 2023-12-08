import {FC, useState} from 'react';
import styles from './Friends.module.scss';
import {useAppSelector} from '../../hooks/useTypedRedux';
import ItemUser from './ItemUser/ItemUser';
import {useGetFollowersPaginationQuery} from '../../services/UserService';
import {FetchBaseQueryError} from "@reduxjs/toolkit/query/react";
import Loader from '../../components/Loader/Loader';
import Alert from '@mui/material/Alert';
import {IFollower} from '../../types/users';
import Pagination from '../../components/Pagination/Pagination';

const Friends: FC = () => {
  const currentTheme = useAppSelector((state) => state.reducerTheme.themeMode);
  const currentUser = useAppSelector((state) => state.reducerAuth.currentUser);
  const [selectedItem, setSelecteItem] = useState('all');
  const numberUsersOnPage = 5;  //Количество друзей, отображаемых на странице
  const [currentPage, setCurrentPage] = useState<number>(1);

  const {data: followersData, error, isLoading} = useGetFollowersPaginationQuery({
    id: currentUser.id,
    page: currentPage,
    limit: numberUsersOnPage,
    selector: selectedItem
  });
  const isFetchBaseQueryErrorType = (error: any): error is FetchBaseQueryError => 'status' in error;

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
              {(followersData && followersData.count !== 0) &&
                followersData.rows.map((follower: IFollower) => 
                <div key={follower.id} className={styles.wrapperFollowers}>
                  <ItemUser
                    curUserId={currentUser.id}
                    username={follower.username}
                    avatar={follower.profilePic}
                    refUser={follower.refUser}
                    status={follower.status} 
                    city={follower.city}
                  />
                  <hr />
                </div>
              )}
              {followersData.count === 0 &&
                <p>Друзья не найдены</p>
              }
            </div>
            {followersData.count &&
              <Pagination
                currentPage={currentPage}
                totalCount={followersData.count}
                pageSize={numberUsersOnPage}
                onPageChange={(page: number) => setCurrentPage(page)}
              />
            }
        </div>
    </div>
  )
} else return <Alert severity="error" sx={{m: 20}}>{JSON.stringify(error)}</Alert>
}

export default Friends;
