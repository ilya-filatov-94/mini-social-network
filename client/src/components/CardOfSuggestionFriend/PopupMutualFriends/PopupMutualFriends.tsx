import {FC} from 'react';
import styles from './PopupMutualFriends.module.scss';
import Portal from '../../../hoc/Portal';
import CloseOutlinedIcon from '@mui/icons-material/CloseOutlined';
import {Link} from 'react-router-dom';
import {urlAPIimages} from '../../../env_variables';
import noAvatar from '../../../assets/images/no-avatar.jpg';
import {useAppSelector} from '../../../hooks/useTypedRedux';
import {useGetMutualFriendsQuery} from '../../../services/UserService';
import {FetchBaseQueryError} from "@reduxjs/toolkit/query/react";
import Loader from '../../Loader/Loader';
import Alert from '@mui/material/Alert';
import {IPossibleFriend} from '../../../types/users';

interface IPopupProps {
    isVisible: boolean; 
    setVisible: (state: boolean) => void;
    curUserId: number;
    usernamePossibleFriend: string;
    possibleFriendId: number;
}

const PopupMutualFriends: FC<IPopupProps> = ({
    isVisible,
    setVisible,
    curUserId,
    usernamePossibleFriend,
    possibleFriendId
}) => {

  const currentTheme = useAppSelector(state => state.reducerTheme.themeMode);
  const {data: mutualFriends, error: errorLoading, isLoading} = useGetMutualFriendsQuery({
    id: curUserId,
    pos_id: possibleFriendId
  }, {skip: !isVisible});
  const isFetchBaseQueryErrorType = (error: any): error is FetchBaseQueryError => 'status' in error;

  if (isVisible) {
    document.body.style.overflow = "hidden";
  } else {
    document.body.style.overflow = "auto";
  }

  if (isLoading) {
    return <Loader />
  }

  if (errorLoading) {
    if (isFetchBaseQueryErrorType(errorLoading)) {
      return ( 
      <Alert severity="error" sx={{m: 20}}>
        Произошла ошибка при загрузке данных! {errorLoading.status}
      </Alert>);
    }
  }

  if (!isVisible) return null;
  
  return (
    <Portal>
      <div className={`${styles.windowPopup} ${isVisible ? styles.active : ''}`}>
        <div className={currentTheme ==='darkMode'
        ? `${styles.contentPopup} ${styles['theme-dark']}`
        : `${styles.contentPopup} ${styles['theme-light']}`
        }>
            <div className={styles.headerWindow}>
                <div className={styles.wrapperHeader}>
                    <h3>Общие друзья</h3>
                    <h3>с пользователем {usernamePossibleFriend}</h3>
                </div>
                <CloseOutlinedIcon 
                    onClick={() => setVisible(false)}
                    className={styles.closeBtn} 
                />
            </div>
            <hr />
            <div className={styles.wrapperUsers}>
                {(mutualFriends && mutualFriends?.length !== 0) &&
                mutualFriends.map((user: IPossibleFriend) => (
                <div key={user.id} className={styles.infoUser}>
                    <img
                        className={styles.avatar}
                        src={user.profilePic ? (urlAPIimages + user.profilePic) : noAvatar}
                        alt={`${user.username} avatar`}
                    />
                    <div className={styles.info}>
                        <Link className={styles.link} to={`/profile/${user.refUser}?id=${curUserId}`}>
                            <p className={styles.username}>{user.username}</p>
                        </Link>
                        <p className={styles.textOfCard}>{user.status}</p>
                    </div>
                </div>))}
            </div>
        </div>
      </div>
    </Portal>
  )
}

export default PopupMutualFriends;
