import {FC, useState, UIEvent} from 'react';
import styles from './Messenger.module.scss';
import {useAppSelector} from '../../hooks/useTypedRedux';
import SearchOutlinedIcon from '@mui/icons-material/SearchOutlined';
import Input from '../../components/Input/Input';

const Messenger: FC = () => {
  const curUser = useAppSelector(state => state.reducerAuth.currentUser);
  const currentTheme = useAppSelector(state => state.reducerTheme.themeMode);

  const [stateSearch, setSearch] = useState(false);

  function toggleSearch(event: UIEvent) {
    event.stopPropagation();
    setSearch(prev => !prev);
  }

  return (
    <div className={`${styles.messengerContainer} ${currentTheme ==='darkMode' 
    ? styles['theme-dark']
    : styles['theme-light']
    }`}>
      <div className={styles.wrapper}>
        <h2>Диалоги</h2>
        <div className={styles.search} onFocus={() => setSearch(prev => !prev)}>
          <SearchOutlinedIcon />
          <Input
            addClass={styles.inputSearch} 
            type="search"
            maxLength={50}
            placeholder="Поиск собеседника..."
          />
          {stateSearch &&
          <button
            className={styles.resetSearchBtn}
            onClick={toggleSearch}
          >
            Отменить
          </button>}
        </div>

        {stateSearch &&
          <p className={styles.notFound}>Поиск собеседника</p>
          //Здесь при наборе текста будут по поисковому запросу выдаваться пользователи
        }

        {!stateSearch &&
          <p className={styles.notFound}>Диалоги отсутствуют</p>
          //Здесь будет показываться список диалогов
        }
        
      </div>
    </div>
  )
}

export default Messenger;
