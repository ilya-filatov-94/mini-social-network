import {FC, useState, useRef, useEffect, useCallback} from 'react';
import styles from './Notifications.module.scss';
import NotificationsOutlinedIcon from '@mui/icons-material/NotificationsOutlined';
import ListNotifications from './ListNotifications/ListNotifications';
import TemplatePopup from '../../TemplatePopup/TemplatePopup';
import { Link } from 'react-router-dom';
import {useAppSelector, useAppDispatch} from '../../../hooks/useTypedRedux';
import { shallowEqual } from 'react-redux';
import { readNotifications, fillNotifications } from '../../../store/notificationSlice';
import {INotification} from '../../../types/notifications';
import { useGetAllNotificationsQuery, useUpdateNotificationsMutation } from '../../../services/UserService';
import {FetchBaseQueryError} from "@reduxjs/toolkit/query/react";
import Alert from '@mui/material/Alert';
import Loader from '../../Loader/Loader';

export interface INotificationProps {
  id: number;
  type: string;
  username: string;
  ref: string;
}

const Notifications: FC = () => {
  const activeNotifications = useAppSelector(state => state.reducerNotifications.notifications, shallowEqual);
  const [notificationsIsOpen, openNotifications] = useState<boolean>(false);
  const refIcon = useRef<HTMLDivElement>(null);
  const offsetLeftParent = useRef<number>(0);
  const [isVisiblePopup, setVisiblePopup] = useState<boolean>(false);
  const dispatch = useAppDispatch();
  const curUser = useAppSelector(state => state.reducerAuth.currentUser, shallowEqual);
  const isFetchBaseQueryErrorType = (error: any): error is FetchBaseQueryError => 'status' in error;
  const {
    data: allNotifications,
    isLoading,
    error: errorLoad,
    refetch
  } = useGetAllNotificationsQuery(curUser.id, {skip: !curUser.id});
  const [updateNotifications, 
    {
      isLoading: isLoadingUpdate,
      error: errorUpdate,
  }] = useUpdateNotificationsMutation();

  useEffect(() => {
    if (allNotifications?.length) {
      dispatch(fillNotifications(allNotifications));
    }
  }, [allNotifications]);

  const unreadNotificaions = activeNotifications?.filter(item => !item.isRead);

  useEffect(() => {
    if (refIcon.current) {
      if (refIcon.current.offsetLeft > 0) {
        offsetLeftParent.current = refIcon.current.offsetLeft - 112;
      }  
    }
  }, [refIcon.current]);

  const closeNotifications = useCallback(async () => {
    dispatch(readNotifications());
    await updateNotifications(curUser.id);
    console.log(curUser.id);
    
    openNotifications(false);
    setVisiblePopup(false);
  }, []);

  const openPopupNotifications = useCallback(async () => {
    dispatch(readNotifications());
    await updateNotifications(curUser.id);
    openNotifications(false);
    await refetch();
  }, []);

  const createTemplateNotification = useCallback((notificationData: INotification) => {
    switch(notificationData.type) {
        case 'addedLike': {
            return (
                <>
                  <span>{`Пользователь ${notificationData.username} оценил Ваш `}</span>
                  <Link 
                    className={styles.link} 
                    to={notificationData.ref} 
                    onClick={closeNotifications}>
                      пост
                  </Link>
                </>
            )
        }
        case 'addedComment': {
            return (
                <>
                  <span>{`Пользователь ${notificationData.username} добавил `}</span>
                  <Link 
                    className={styles.link} 
                    to={notificationData.ref}
                    onClick={closeNotifications}>
                      комментарий
                    </Link>
                  <span> к Вашему посту</span>
                </>
            )
        }
        case 'sharedPost': {
            return (
                <>
                  <span>{`Пользователь ${notificationData.username} поделился Вашим `}</span>
                  <Link 
                    className={styles.link} 
                    to={notificationData.ref}
                    onClick={closeNotifications}>
                      постом
                  </Link>
                </>
            )
        }
        case 'addedInFriends': {
            return (
                <>  
                  <span>Пользователь </span>
                  <Link 
                    className={styles.link} 
                    to={notificationData.ref}
                    onClick={closeNotifications}>
                      {notificationData.username}
                  </Link>
                  <span> добавил Вас в друзья</span>
                </>
            )
        }
    }
  }, [allNotifications]);

  const renderContentPopupNotifcation = useCallback((notifications: INotification[] | undefined) => {
    return (
        <div className={styles.wrapperPopup}>
        {(!!notifications && notifications?.length > 0) &&
          notifications.map((notification: INotification) => (
          <div key={notification.id} className={styles.wrapperList}>
            <p className={styles.text}>
                {createTemplateNotification(notification)}
            </p>
            <hr/>
          </div>))}
        {(isLoading || isLoadingUpdate) && <Loader />}
        {(errorLoad || errorUpdate) && renderError()}
        {(!!notifications && notifications?.length === 0 && !errorLoad && !isLoading) && (
          <p className={styles.text}>Уведомлений нет</p>
        )}
        </div>
      )
  }, [allNotifications]);

  function renderError() {
    if (isFetchBaseQueryErrorType(errorLoad)) {
      return (
        <Alert severity="error" sx={{m: 20}}>
            {`Произошла ошибка при загрузке данных! ${errorLoad.status}`}
        </Alert>
      )
    }
  }

  return (
    <div className={styles.wrapper} ref={refIcon}>
      <NotificationsOutlinedIcon onClick={() => openNotifications(true)} />
      {!!unreadNotificaions?.length && <div className={styles.label} />}
      <ListNotifications
        listNotifications={unreadNotificaions}
        isVisible={notificationsIsOpen}
        closeNotifications={openPopupNotifications}
        offsetLeftParent={offsetLeftParent.current}
        createTemplateNotification={createTemplateNotification}
        setVisiblePopup={setVisiblePopup}
      />
      <TemplatePopup 
        isVisible={isVisiblePopup} 
        setVisible={() => setVisiblePopup(false)}
        headerPopup='Все уведомления'
        contentPopup={renderContentPopupNotifcation(allNotifications!)}
      />
    </div>
  )
}

export default Notifications;
