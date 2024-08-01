import {FC, memo, useCallback} from 'react';
import styles from './PopupMutualFriends.module.scss';
import {Link} from 'react-router-dom';
import {urlAPIimages} from '../../../env_variables';
import noAvatar from '../../../assets/images/no-avatar.jpg';
import {useGetMutualFriendsQuery} from '../../../services/UserService';
import {FetchBaseQueryError} from "@reduxjs/toolkit/query/react";
import Loader from '../../Loader/Loader';
import Alert from '@mui/material/Alert';
import {IPossibleFriend} from '../../../types/users';
import {IDataPosFriend} from '../CardOfSuggestionFriend';
import TemplatePopup from '../../TemplatePopup/TemplatePopup';

interface IPopupProps {
  isVisible: boolean; 
  setVisible: (state: boolean) => void;
  curUserId: number;
  dataPossibleFr: IDataPosFriend;
}

const PopupMutualFriends: FC<IPopupProps> = memo(({
  isVisible,
  setVisible,
  curUserId,
  dataPossibleFr,
}) => {

  const {data: mutualFriends, error: errorLoading, isLoading} = useGetMutualFriendsQuery({
    id: curUserId,
    pos_id: dataPossibleFr.indexPossibleFriend
  }, {skip: !isVisible});
  const isFetchBaseQueryErrorType = (error: any): error is FetchBaseQueryError => 'status' in error;

  const renderHeader = useCallback((title: string) => {
    return (
      <div>
        <h3>Общие друзья с пользователем</h3>
        <h3 className={styles.secondHeader}>{title}</h3>
      </div>
    )
  }, []);

  const renderContent = useCallback((mutualFriends: IPossibleFriend[] | undefined) => {
    return (
      <div className={styles.wrapperUsers}>
      {(!!mutualFriends && mutualFriends?.length > 0) &&
      mutualFriends?.map((user: IPossibleFriend) => (
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
    )
  }, []);

  if (!isVisible) return null;

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

  return (
    <TemplatePopup
      isVisible={isVisible} 
      setVisible={() => setVisible(false)}
      headerPopup={renderHeader(dataPossibleFr.namePossibleFriend)}
      contentPopup={renderContent(mutualFriends)}
    />
  )
});

export default PopupMutualFriends;
