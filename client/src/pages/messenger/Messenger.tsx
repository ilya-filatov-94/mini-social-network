import {FC, useState, UIEvent} from 'react';
import styles from './Messenger.module.scss';
import {RootState} from '../../store/index';
import {useAppSelector} from '../../hooks/useTypedRedux';
import SearchOutlinedIcon from '@mui/icons-material/SearchOutlined';
import Input from '../../components/Input/Input';
import Conversation from './Conversation/Conversation';

//Mock Данные диалога
const MockConversation = {
  username: 'John Doe',
  avatar: '',
  refUser: 'JohnDoe21',
  refDialog: '1',
  lastMessage: 'Привет, Джон, давно не виделись, как твои дела?',
  status: 'online',
}

const Messenger: FC = () => {
  const curUser = useAppSelector((state: RootState) => state.reducerAuth.currentUser);
  const currentTheme = useAppSelector((state: RootState) => state.reducerTheme.themeMode);

  const [stateSearch, setSearch] = useState(false);

  console.log('Рендер Messenger произошёл');
  

  function toggleSearch(event: UIEvent) {
    event.stopPropagation();
    setSearch(prev => !prev);
  }

  
  return (
    <div className={`${styles.messengerContainer}
    ${currentTheme ==='darkMode' 
    ? styles['theme-dark']
    : styles['theme-light']
    }`}>
      <div className={styles.mainWrapper}>
      <div className={`${styles.wrapper} ${styles.headerWrapper}`}>
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
      </div>

      <div className={`${styles.wrapper} ${styles.listConversations}`}>
        {stateSearch &&
          <p className={styles.notFound}>Поиск собеседника</p>
          //Здесь при наборе текста будут по поисковому запросу выдаваться пользователи
        }

        {!stateSearch &&
          // <p className={styles.notFound}>Диалоги отсутствуют</p>
          <div className={styles.wrapperConversations}>
            <Conversation
              addClass={`${styles.itemConversation} ${currentTheme ==='darkMode' ? styles['theme-dark'] : ''}`}
              username={MockConversation.username}
              avatar={MockConversation.avatar}
              refUser={MockConversation.refUser}
              refDialog={MockConversation.refDialog}
              lastMessage={MockConversation.lastMessage}
              status={MockConversation.status}
            />
            <Conversation
              addClass={`${styles.itemConversation} ${currentTheme ==='darkMode' ? styles['theme-dark'] : ''}`}
              username={MockConversation.username}
              avatar={MockConversation.avatar}
              refUser={MockConversation.refUser}
              refDialog={MockConversation.refDialog}
              lastMessage={MockConversation.lastMessage}
              status={MockConversation.status}
            />

          </div>
        }
        
      </div>
      </div>
    </div>
  )
}

export default Messenger;
