import {
  FC, 
  useState,
  useMemo,
  useEffect,
  useRef,
} from 'react';
import styles from './LeftBar.module.scss';
import {useAppSelector, useAppDispatch} from '../../hooks/useTypedRedux';
import { shallowEqual } from 'react-redux';
import MenuElement from './MenuElement/MenuElement';
import MenuUser from '../Navbar/MenuUser/MenuUser';
import UserAvatar from '../UserAvatar/UserAvatar';
import {
  basicMenuIcons,
  shortcutsMenuIcons,
  otherMenuIcons
} from './MenuElement/iconsMenu';
import { useGetUnreadMsgsForConversationsQuery } from '../../services/MessengerService';
import {FetchBaseQueryError} from "@reduxjs/toolkit/query/react";
import ErrorOutlinedIcon from '@mui/icons-material/ErrorOutlined';
import TemplatePopup from '../TemplatePopup/TemplatePopup';
import {updateUnreadMsgsList} from '../../store/messagesSlice';

const LeftBar: FC = () => {

  const currentTheme = useAppSelector(state => state.reducerTheme.themeMode, shallowEqual);
  const currentUser = useAppSelector(state => state.reducerAuth.currentUser, shallowEqual);
  const unReadMessagesState = useAppSelector(state => state.reducerMessages.unreadMsgsList, shallowEqual);
  const dispatch = useAppDispatch();
  const [menuIsOpen, openMenu] = useState<boolean>(false);
  const [isErrorGetUnreadMsgs, setModalErrorClose] = useState<boolean>(false);
  const {
    data: unReadMessages,
    error: errorGetMessages,
  } = useGetUnreadMsgsForConversationsQuery(currentUser.id, {skip: !currentUser.id});
  const isFetchBaseQueryErrorType = (error: any): error is FetchBaseQueryError => "status" in error;

  useEffect(() => {
    if (unReadMessages && Object.keys(unReadMessagesState).length === 0) {
      dispatch(updateUnreadMsgsList(unReadMessages));
    }
  }, [unReadMessages, unReadMessagesState]);

  if (errorGetMessages) {
    if (isFetchBaseQueryErrorType(errorGetMessages)) {
      setModalErrorClose(true);
    }
  }

  return (
    <div className={currentTheme ==='darkMode'
      ? `${styles.leftBar} ${styles['theme-dark']}`
      : `${styles.leftBar} ${styles['theme-light']}`
    }>
      <div className={styles.container}>

        <div className={styles.menu}>
          <UserAvatar 
            onClick={() => openMenu(!menuIsOpen)}
            addClass={styles.user}
            avatar={currentUser.profilePic}
            name={currentUser.username}
            def_size_ico={30}
            tabletmode={styles.tabletBar}
          />
          <MenuUser 
            isVisible={menuIsOpen}
            setVisible={openMenu}
            curUser={currentUser}
            curTheme={currentTheme}
            position={styles.positionMenuUser}
          />
          {basicMenuIcons.map(item =>
              <MenuElement 
                key={item.id}
                image={item.image} 
                textElem={item.name}
                menuRef={item.menuRef}
                counterUnreadMsgs={unReadMessagesState}
              />
          )} 
        </div>

        <hr />
        <div className={styles.menu}>
          <span className={styles.styleText}>Развлечения</span>
          {shortcutsMenuIcons.map(item =>
              <MenuElement 
                key={item.id}
                image={item.image} 
                textElem={item.name} 
                menuRef={item.menuRef}
              />
          )} 
        </div>

        <hr />
        <div className={styles.menu}>
          <span className={styles.styleText}>Разное</span>
          {otherMenuIcons.map(item =>
              <MenuElement 
                key={item.id}
                image={item.image} 
                textElem={item.name}
                menuRef={item.menuRef}
              />
          )} 
        </div>

        <TemplatePopup 
          isVisible={isErrorGetUnreadMsgs} 
          setVisible={setModalErrorClose}
          headerPopup={<p>Ошибка!</p>}
          contentPopup={
          <div className={styles.errorShared}>
            <ErrorOutlinedIcon style={{color: 'red'}}/><p>Не удалось поделиться</p>
          </div>
        }
        />

      </div>
    </div>
  );
}

export default LeftBar;




