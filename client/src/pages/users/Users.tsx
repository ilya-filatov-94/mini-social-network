import {FC, useState, useEffect, ChangeEvent} from 'react';
import styles from './Users.module.scss';
import {useAppSelector} from '../../hooks/useTypedRedux';
import SearchOutlinedIcon from '@mui/icons-material/SearchOutlined';
import Input from '../../components/Input/Input';
import ItemUser from './ItemUser/ItemUser';
import {IListUsers, IResponseListUsers} from '../../types/users';
import {AxiosError} from 'axios';
import {instanceAxios} from '../../helpers/instanceAxios';
import Alert from '@mui/material/Alert';
import {debounce} from '../../helpers/debounce';
import Pagination from '../../components/Pagination/Pagination';

const Users: FC = () => {
  const curUser = useAppSelector(state => state.reducerAuth.currentUser);
  const currentTheme = useAppSelector(state => state.reducerTheme.themeMode);

  //Состояние для пагинации
  const numberUsersOnPage = 5;
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [countUsers, setCountUsers] = useState<number>(0);

  const [listUsers, setListUsers] = useState<IListUsers[]>([]);
  const [search, setSearch] = useState<string>('');
  const [isErrorStatus, setErrorStatus] = useState<number>();

  const handlerChange = debounce((event: ChangeEvent<HTMLInputElement>) => {
    event.preventDefault();
    setSearch(event.target.value);
  }, 1000);

  useEffect(() => {
    getUsers(search, curUser.id, currentPage, numberUsersOnPage)
    .then(users => {
      setErrorStatus(undefined);
      setListUsers(users.data.rows);
      setCountUsers(users.data.count);
    })
    .catch((error: any) => {      
      if (error instanceof AxiosError) {
        setErrorStatus(error?.response?.status);
        if (error?.response?.data?.message) {
          setErrorStatus(error?.response?.data?.message);
        }
        if (error?.message) {
          if (error?.message === 'Network Error') {
            setErrorStatus(500);
          }
        }
      } else {
        let errorMessage = error?.response?.status;
        setErrorStatus(errorMessage || 500);  
      }    
    })
  }, [search, curUser.id, currentPage]);

  if (isErrorStatus) {
    return ( 
      <Alert severity="error" sx={{m: 20}}>
        Произошла ошибка при загрузке данных! {isErrorStatus}
      </Alert>
    );
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
          />
        )}
        {!listUsers?.length &&
          <p className={styles.notFound}>Пользователи не найдены</p>
        }
        {listUsers &&
          <Pagination
          currentPage={currentPage}
          totalCount={countUsers}
          pageSize={numberUsersOnPage}
          onPageChange={(page: number) => setCurrentPage(page)}
        />}
      </div>
    </div>
  )
}

async function getUsers(search: string, id: number, page: number, limit: number) {
  return instanceAxios.get<IResponseListUsers>(
    `/user/all-selected?search=${search}&id=${id}&page=${page}&limit=${limit}`
  );
}

export default Users;
