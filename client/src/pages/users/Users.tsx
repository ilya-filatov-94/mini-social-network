import {FC} from 'react';
import styles from './Users.module.scss';
import {useAppSelector} from '../../hooks/useTypedRedux';
import SearchOutlinedIcon from '@mui/icons-material/SearchOutlined';
import Input from '../../components/Input/Input';
import ItemUser from './ItemUser/ItemUser';

const Users: FC = () => {
  const curUser = useAppSelector(state => state.reducerAuth.currentUser);
  const currentTheme = useAppSelector(state => state.reducerTheme.themeMode);


  return (
    <div className={currentTheme ==='darkMode'
        ? `${styles.usersContainer} ${styles['theme-dark']}`
        : `${styles.usersContainer} ${styles['theme-light']}`
        }>
        <div className={styles.wrapperUsers}>
            <div className={styles.search}>
                <SearchOutlinedIcon />
                <Input addClass={styles.inputSearch} type="search" placeholder="Поиск..."/>
            </div>
            <ItemUser 
              username={'Mary Stark'}
              avatar={''}
              refUser={'/MaryStark25'}
              status={'offline'}
              city={'Moscow'}
              subscrInformation={false}
            />
        </div>
    </div>
  )
}

export default Users;
