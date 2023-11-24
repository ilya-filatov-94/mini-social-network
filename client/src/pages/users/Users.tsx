import {FC} from 'react';
import styles from './Users.module.scss';
import {useAppSelector} from '../../hooks/useTypedRedux';
import SearchOutlinedIcon from '@mui/icons-material/SearchOutlined';
import Input from '../../components/Input/Input';
import ItemUser from './ItemUser/ItemUser';
import {IListUsers} from '../../types/users';
import {useGetAllUsersQuery} from '../../services/UserService';
import {FetchBaseQueryError} from "@reduxjs/toolkit/query/react";
import Loader from '../../components/Loader/Loader';
import Alert from '@mui/material/Alert';

const Users: FC = () => {
  const curUser = useAppSelector(state => state.reducerAuth.currentUser);
  const {data: listUsers, error, isLoading, isSuccess} = useGetAllUsersQuery(curUser.id);
  const isFetchBaseQueryErrorType = (error: any): error is FetchBaseQueryError => 'status' in error;
  const currentTheme = useAppSelector(state => state.reducerTheme.themeMode);

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
  
  return (
    <div className={currentTheme ==='darkMode'
        ? `${styles.usersContainer} ${styles['theme-dark']}`
        : `${styles.usersContainer} ${styles['theme-light']}`
        }>
        <div className={styles.wrapperUsers}>
            <h2>Все пользователи</h2>
            <div className={styles.search}>
                <SearchOutlinedIcon />
                <Input addClass={styles.inputSearch} type="search" placeholder="Поиск..."/>
            </div>
            {(listUsers && listUsers?.length !== 0) &&
            listUsers.map((user: IListUsers) =>
            <ItemUser 
              key={user.id}
              myId={curUser.id}
              userId={user.id}
              username={user.username}
              avatar={user.profilePic}
              refUser={user.refUser}
              status={user.status}
              city={user.city}
              subscrInformation={user.subscrStatus}
            />)}
            {isSuccess && !listUsers?.length &&
              <p>Пользователи не найдены</p>
            }
        </div>
    </div>
  )
}

export default Users;
