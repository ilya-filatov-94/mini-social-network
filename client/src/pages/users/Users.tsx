import {FC, useState, ChangeEvent} from 'react';
import styles from './Users.module.scss';
import {useAppSelector} from '../../hooks/useTypedRedux';
import { shallowEqual } from 'react-redux';
import SearchOutlinedIcon from '@mui/icons-material/SearchOutlined';
import Input from '../../components/Input/Input';
import ItemUser from './ItemUser/ItemUser';
import {IListUsers} from '../../types/users';
import {useGetSearchAllUsersQuery} from '../../services/UserService';
import {FetchBaseQueryError} from "@reduxjs/toolkit/query/react";
import Loader from '../../components/Loader/Loader';
import Alert from '@mui/material/Alert';
import {debounce} from '../../helpers/debounce';
import Pagination from '../../components/Pagination/Pagination';

const Users: FC = () => {
  const curUser = useAppSelector(state => state.reducerAuth.currentUser, shallowEqual);
  const currentTheme = useAppSelector(state => state.reducerTheme.themeMode, shallowEqual);

  const numberUsersOnPage = 5;  //Количество отображаемых пользователей на одной странице
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [search, setSearch] = useState<string>('');

  const handlerChange = debounce((event: ChangeEvent<HTMLInputElement>) => {
    event.preventDefault();
    setSearch(event.target.value);
  }, 1000);

  const {data: listUsers, error, isLoading} = useGetSearchAllUsersQuery({
    id: curUser.id,
    page: currentPage,
    limit: numberUsersOnPage,
    search: search
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

  return (
    <div className={currentTheme ==='darkMode'
        ? `${styles.usersContainer} ${styles['theme-dark']}`
        : `${styles.usersContainer} ${styles['theme-light']}`
    }>
      <div className={styles.wrapperUsers}>
        <h2>Все пользователи</h2>
        <div className={styles.search}>
          <SearchOutlinedIcon />
          <Input
            onChange={handlerChange} 
            addClass={styles.inputSearch} 
            type="search" 
            placeholder="Поиск..."
          />
        </div>
        {(listUsers && listUsers.count !== 0) &&
          listUsers.rows.map((user: IListUsers) =>
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
          />
        )}
        {!listUsers?.count &&
          <p className={styles.notFound}>Пользователи не найдены</p>
        }
        {listUsers?.count !== 0 &&
          <Pagination
            currentPage={currentPage}
            totalCount={listUsers?.count || 0}
            pageSize={numberUsersOnPage}
            onPageChange={(page: number) => setCurrentPage(page)}
          />
        }
      </div>
    </div>
  )
}

export default Users;
