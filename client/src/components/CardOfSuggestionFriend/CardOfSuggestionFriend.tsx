import {FC, useState, memo} from 'react';
import styles from './CardOfSuggestionFriend.module.scss';
import {urlAPIimages} from '../../env_variables';
import noAvatar from '../../assets/images/no-avatar.jpg';
import {Link} from 'react-router-dom';
import Button from '../Button/Button';
import {IPossibleFriend} from '../../types/users';
import {
  useGetPossibleFriendsQuery,
  useSubscribeToUserMutation
} from '../../services/UserService';
import {FetchBaseQueryError} from "@reduxjs/toolkit/query/react";
import Loader from '../../components/Loader/Loader';
import ErrorOutlineOutlinedIcon from '@mui/icons-material/ErrorOutlineOutlined';
import PopupMutualFriends from './PopupMutualFriends/PopupMutualFriends';

interface ISuggestionProps {
  idCurUser: number;
}

export interface IDataPosFriend {
  indexPossibleFriend: number;
  namePossibleFriend: string;
}

const CardOfSuggestionFriend: FC<ISuggestionProps> = memo(({
  idCurUser,
}) => {

  const {data: possibleFriends, error: errorLoading, isLoading} = useGetPossibleFriendsQuery(idCurUser, 
    {skip: !idCurUser});
  const [subscribeToUser, {error: errorSubscribe}] = useSubscribeToUserMutation();
  const isFetchBaseQueryErrorType = (error: any): error is FetchBaseQueryError => 'status' in error;
  const [isVisiblePopup, setVisiblePopup] = useState<boolean>(false);
  const [dataPossibleFr, setDataPossibleFr] = useState<IDataPosFriend>({
    indexPossibleFriend: 0, 
    namePossibleFriend: ''
  });

  function showMutualFriends(idUser: number, username: string) {
    setDataPossibleFr({
      indexPossibleFriend: idUser, 
      namePossibleFriend: username
    });
    setVisiblePopup(true);
  }

  async function subscribe(idUser: number) {
    await subscribeToUser({curUserId: idCurUser, followerId: idUser}).unwrap();
  }

  if (isLoading) {
    return <Loader />
  }

  if (errorLoading) {
    if (isFetchBaseQueryErrorType(errorLoading)) {
      return ( 
        <div className={styles.isErrorLoading}>
          <div className={styles.MuiAlert}><ErrorOutlineOutlinedIcon/></div>
          <span>Ошибка! {errorLoading.status}</span>
        </div>);
    }
    if (isFetchBaseQueryErrorType(errorSubscribe)) {
      return ( 
        <div className={styles.isErrorLoading}>
          <div className={styles.MuiAlert}><ErrorOutlineOutlinedIcon/></div>
          <span>Ошибка! {errorSubscribe.status}</span>
        </div>);
    }
  }

  if (!possibleFriends || possibleFriends?.length === 0) {
    return <p className={styles.emptyActivities}>Нет предложений</p>
  }

  return (
    <>
    {(possibleFriends && possibleFriends?.length !== 0) &&
    possibleFriends.map((user: IPossibleFriend) => (
    <div key={user.id} className={styles.user}>
      <img
        className={styles.avatar}
        src={user.profilePic ? urlAPIimages + user.profilePic : noAvatar}
        alt={`${user.username} avatar`}
      />
      <div className={styles.infoUser}>
        <Link className={styles.link} to={`/profile/${user.refUser}?id=${idCurUser}`}>
          <p className={styles.username}>{user.username}</p>
        </Link>
        <p className={styles.textOfCard}>Общих друзей: {user.numberMutualFriends}</p>
        <div className={styles.wrapperBtns}>
          <Button
            onClick={() => showMutualFriends(user.id, user.username)}
            addClass={styles.btn}
          >Посмотреть друзей</Button>
          <Button 
            onClick={() => subscribe(user.id)}
            addClass={styles.btn}
          >Подписаться</Button>
        </div>
      </div>
    </div>
    ))}
    {(possibleFriends && possibleFriends?.length !== 0) &&
      <PopupMutualFriends
        isVisible={isVisiblePopup}
        setVisible={setVisiblePopup}
        curUserId={idCurUser}
        dataPossibleFr={dataPossibleFr}
      />
    }
    </>
  );
});

export default CardOfSuggestionFriend;
