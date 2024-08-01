import {FC} from 'react';
import styles from './ListNotifications.module.scss';
import Portal from '../../../../hoc/Portal';
import {useAppSelector} from '../../../../hooks/useTypedRedux';
import { shallowEqual } from 'react-redux';
import {useMatchMedia} from '../../../../hooks/useMatchMedia';
import {INotification} from '../../../../types/notifications';
import Button from '../../../Button/Button';

interface IListNotificationsProps {
    listNotifications: INotification[];
    isVisible: boolean; 
    closeNotifications: () => void;
    offsetLeftParent: number;
    createTemplateNotification: (notificationData: INotification) => JSX.Element | undefined;
    setVisiblePopup: React.Dispatch<React.SetStateAction<boolean>>;
}

const ListNotifications: FC<IListNotificationsProps> = ({
    listNotifications,
    isVisible,
    closeNotifications,
    offsetLeftParent,
    createTemplateNotification,
    setVisiblePopup
}) => {
    const currentTheme = useAppSelector(state => state.reducerTheme.themeMode, shallowEqual);
    const {isMobile} = useMatchMedia();

    function openPopup() {
        setVisiblePopup(true);
        closeNotifications();
    }

    function setOffsetElement(offsetElement: number) {
        if (offsetElement > 0 && !isMobile) {
           return {left: String(offsetElement)+'px'}; 
        } else return {};
    }
    if (!isVisible) return null;

    return (
    <Portal>
      <div className={styles.wrapper} onClick={closeNotifications}>
        <div className={currentTheme ==='darkMode'
            ? `${styles.contentWindow} ${styles['theme-dark']}`
            : `${styles.contentWindow} ${styles['theme-light']}`
        } style={setOffsetElement(offsetLeftParent)}
        onClick={event => (event.stopPropagation())}>

            <div className={styles.wrapperList}>
                {!listNotifications?.length && <p className={styles.text}>
                    Нет новых уведомлений
                </p>}
                {!!listNotifications?.length && (
                    listNotifications.map((notification, index) => {
                        if (index < 3) return (
                        <div key={notification.id}>
                            <p className={styles.text}>
                                {createTemplateNotification(notification)}
                            </p>
                            {index < 2 ? <hr/> : null}
                        </div>)
                        else return null;
                    })
                )}
                <div className={styles.wrapperBtn}>
                    <Button addClass={styles.btn} onClick={openPopup}>Показать все</Button>
                </div>
            </div>

        </div>
      </div>
    </Portal>
  )
}

export default ListNotifications;
