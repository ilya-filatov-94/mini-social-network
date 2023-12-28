import {FC, useState, ChangeEvent, useRef, UIEvent} from 'react';
import styles from './Messenger.module.scss';
import {RootState} from '../../store/index';
import {useAppSelector} from '../../hooks/useTypedRedux';
import SearchOutlinedIcon from '@mui/icons-material/SearchOutlined';
import Conversation from './Conversation/Conversation';
import {
  useSearchSelectedMembersQuery, 
  useGetConversationsQuery,
  useOpenConversationMutation
} from '../../services/MessengerService';
import {FetchBaseQueryError} from "@reduxjs/toolkit/query/react";
import {debounce} from '../../helpers/debounce';
import LoaderMessenger from './LoaderMessenger/LoaderMessenger';
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

  const [openConversation, {
    isError: isErrorOpenConversation, 
    isLoading: isLoadingOpenConversation
  }] = useOpenConversationMutation();

  function isFetchBaseQueryError(
    error: unknown
  ): error is FetchBaseQueryError {
    return typeof error === 'object' && error != null && 'status' in error
  }

  function toggleSearch(event: UIEvent) {
    event.stopPropagation();
    setSearchLine('');
    if (inputRef.current) {
      inputRef.current.value = '';
    }
    setFocusInput(false);
  }

  function setErrorOrLoading(
    isLoadingSearch: boolean, 
    isLoadingConversations: boolean, 
    isLoadingOpenConversation: boolean
  ) {
    const isLoading = isLoadingSearch || isLoadingConversations || isLoadingOpenConversation;
    if (isLoading) {
      return <LoaderMessenger />
    } else if (isFetchBaseQueryError(errorSearchUser)) {
      return (
        <Alert severity="error" sx={{m: 5}}>
          Ошибка {errorSearchUser.status}
        </Alert>
      )
    }
    else if (isFetchBaseQueryError(errorGetConversations)) {
      return (
        <Alert severity="error" sx={{ m: 5 }}>
          Произошла ошибка при загрузке данных! {errorGetConversations.status}
        </Alert>
      );
    }
    else if (isErrorOpenConversation) {
      return (
        <Alert severity="error" sx={{m: 5}}>
          Ошибка открытия диалога
        </Alert>
      )
    }
    else {
      return <div className={styles.filler}/>
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
        {setErrorOrLoading(isLoadingSearch, isLoadingConversations, isLoadingOpenConversation)}
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
                openConversation={openConversation}
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
                openConversation={openConversation}
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
