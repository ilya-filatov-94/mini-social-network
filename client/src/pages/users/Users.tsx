import {FC, useState, useEffect, ChangeEvent} from 'react';
import styles from './Users.module.scss';
import {useAppSelector} from '../../hooks/useTypedRedux';
import SearchOutlinedIcon from '@mui/icons-material/SearchOutlined';
import Input from '../../components/Input/Input';
import ItemUser from './ItemUser/ItemUser';
import {IListUsers} from '../../types/users';
import axios from 'axios';
import {instanceAxios} from '../../helpers/instanceAxios';
import Alert from '@mui/material/Alert';
import {debounce} from '../../helpers/debounce';


const Users: FC = () => {
  const curUser = useAppSelector(state => state.reducerAuth.currentUser);
  const currentTheme = useAppSelector(state => state.reducerTheme.themeMode);

  const [listUsers, setListUsers] = useState<IListUsers[]>([]);
  const [search, setSearch] = useState<string>('');
  const [isErrorStatus, setErrorStatus] = useState<number>();

  const handlerChange = debounce((event: ChangeEvent<HTMLInputElement>) => {
    event.preventDefault();
    setSearch(event.target.value);
  }, 1000);

  useEffect(() => {
    getUsers(search, curUser.id)
    .then(users => {
      setErrorStatus(undefined);
      setListUsers(users.data);
    })
    .catch((error: any) => {      
      if (error instanceof axios.AxiosError) {
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
  }, [search, curUser.id]);

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
            />)}
            {!listUsers?.length &&
              <p className={styles.notFound}>Пользователи не найдены</p>
            }
        </div>
    </div>
  )
}

async function getUsers(search: string, id: number) {
  // return await axios.get(API_URL + '/user/all-selected',
  //   {
  //     headers: {
  //       'authorization': `Bearer ${token}`
  //     },
  //     params: {
  //       search: search,
  //       id: id,
  //     }
  // });
  return instanceAxios.get<IListUsers[]>(`/user/all-selected?search=${search}&id=${id}`);
}

export default Users;
