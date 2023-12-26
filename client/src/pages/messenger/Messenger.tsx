import {FC, useState, ChangeEvent, useRef, UIEvent} from 'react';
import styles from './Messenger.module.scss';
import {RootState} from '../../store/index';
import {useAppSelector} from '../../hooks/useTypedRedux';
import SearchOutlinedIcon from '@mui/icons-material/SearchOutlined';
import Conversation from './Conversation/Conversation';
import {
  useSearchSelectedMembersQuery, 
  useGetConversationsQuery
} from '../../services/MessengerService';
import {FetchBaseQueryError} from "@reduxjs/toolkit/query/react";
import {debounce} from '../../helpers/debounce';
import Loader from '../../components/Loader/Loader';
import Alert from '@mui/material/Alert';


const Messenger: FC = () => {
  const curUser = useAppSelector((state: RootState) => state.reducerAuth.currentUser);
  const currentTheme = useAppSelector((state: RootState) => state.reducerTheme.themeMode);

  const [focusInput, setFocusInput] = useState(false);
  const [searchLine, setSearchLine] = useState<string>('');
  const inputRef = useRef<HTMLInputElement>(null);

  const handlerSearch = debounce((event: ChangeEvent<HTMLInputElement>) => {
    event.preventDefault();
    setSearchLine(event.target.value);
  }, 1000);

  const {
    data: listSearchMembers, 
    error: errorSearchUser, 
    isLoading: isLoadingSearch
  } = useSearchSelectedMembersQuery({
    id: curUser.id,
    selector: searchLine
  });
  const {
    data: listConversations, 
    error: errorGetConversations, 
    isLoading: isLoadingConversations
  } = useGetConversationsQuery(curUser.id);
  const isFetchBaseQueryErrorType = (error: any): error is FetchBaseQueryError => 'status' in error;

  function toggleSearch(event: UIEvent) {
    event.stopPropagation();
    setSearchLine('');
    if (inputRef.current) {
      inputRef.current.value = '';
    }
    setFocusInput(false);
  }

  if (errorSearchUser || errorGetConversations) {
    if (isFetchBaseQueryErrorType(errorSearchUser)) {
      return ( 
      <Alert severity="error" sx={{m: 20}}>
        Ошибка при поиске собеседника! {errorSearchUser.status}
      </Alert>);
    }
    if (isFetchBaseQueryErrorType(errorGetConversations)) {
      return ( 
      <Alert severity="error" sx={{m: 20}}>
        Ошибка при загрузке диалогов! {errorGetConversations.status}
      </Alert>);
    }
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
        <div className={styles.search} onClick={() => setFocusInput(true)}>
          <SearchOutlinedIcon />
          <input
            ref={inputRef}
            className={styles.inputSearch}
            onChange={handlerSearch}
            type="text"
            maxLength={50}
            placeholder="Поиск собеседника..."
          />
          {focusInput &&
          <button
            className={styles.resetSearchBtn}
            onClick={toggleSearch}
          >
            Отменить
          </button>}
        </div>
        {isLoadingSearch && <Loader />}
        {isLoadingConversations && <Loader />}
      </div>

      <div className={`${styles.wrapper} ${styles.listConversations}`}>
        {focusInput &&
          (listSearchMembers && listSearchMembers.length !== 0) &&
            listSearchMembers?.map(user => 
              <Conversation
                key={user.id}
                curUserId={curUser.id}
                memberId={user.id!}
                addClass={`${styles.itemConversation} ${currentTheme ==='darkMode' ? styles['theme-dark'] : ''}`}
                username={user.username}
                refUser={user.refUser}
                profilePic={user.profilePic}
                status={user.status}
              />
          )
        }

        {!focusInput &&
          <div className={styles.wrapperConversations}>
            {(listConversations && listConversations.length !== 0) &&
              listConversations?.map(conversation => 
              <Conversation
                key={conversation.id}
                id={conversation.id}
                curUserId={curUser.id}
                memberId={conversation.memberId}
                lastMessageText={conversation.lastMessageText}
                addClass={`${styles.itemConversation} ${currentTheme ==='darkMode' ? styles['theme-dark'] : ''}`}
                username={conversation.username}
                profilePic={conversation.profilePic}
                refUser={conversation.refUser}
                status={conversation.status}
              />
            )}
            {(listConversations && listConversations.length === 0) && 
              <p className={styles.notFound}>Диалоги отсутствуют</p>}
          </div>
        }
        
      </div>
      </div>
    </div>
  )
}

export default Messenger;
