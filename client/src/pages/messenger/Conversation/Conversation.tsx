import {FC} from 'react';
import styles from './Conversation.module.scss';
import noAvatar from '../../../assets/images/no-avatar.jpg';
import {urlAPIimages} from '../../../env_variables';
import {useNavigate} from "react-router-dom";
import {useOpenConversationMutation} from '../../../services/MessengerService';
import Loader from '../../../components/Loader/Loader';
import Alert from '@mui/material/Alert';
import {FetchBaseQueryError} from "@reduxjs/toolkit/query/react";
import {useAppDispatch} from '../../../hooks/useTypedRedux';
import {setCurrentConversationData} from '../../../store/messagesSlice';
import {IConversation} from '../../../types/messenger';

export interface IPropsConversation {
  id?: number;
  curUserId: number;
  memberId: number;
  lastMessageText?: string;
  username: string;
  profilePic: string | undefined;
  refUser: string;
  status?: string;
  addClass?: string;
}

interface IDataResponseConversation {
  data: IConversation;
}

const Conversation: FC<IPropsConversation> = ({
  id,
  lastMessageText,
  curUserId,
  memberId,
  username,
  profilePic,
  refUser,
  status,
  addClass,
}) => {

  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const [openConversation, {
    error: errorOpenConversation, 
    isLoading: isLoadingOpenConversation
  }] = useOpenConversationMutation();

  async function clickConversation() {
    const {data} = await openConversation({
      userId: curUserId, 
      memberId: memberId
    }) as IDataResponseConversation;

    dispatch(setCurrentConversationData({
      id: data.id,
      memberId: data.memberId,
      lastMessageId: data.lastMessageId,
      lastMessageText: data.lastMessageText,
      username: data.username,
      profilePic: data.profilePic,
      refUser: data.refUser,
      status: data.status
    }));
    navigate(`/messages/${data.id}`);
  }

  function previewTruncMsg(text: string, maxlength: number) {
    return (text.length > maxlength) ?
        text.slice(0, maxlength - 1) + '…' : text;
  }

  return (
    <div 
      onClick={clickConversation}
      className={`${styles.userItem} ${addClass ? addClass : ''}`}
    >
      <img
        className={styles.avatar}
        src={profilePic ? urlAPIimages + profilePic : noAvatar}
        alt={`${username} avatar`}
      />
      <div className={styles.infoUser}>
        <p className={styles.username}>{username}</p>
        {status &&
          <p className={styles.infoText}>{status}</p>
        }
        {lastMessageText &&
          <p className={styles.previewMsg}>{previewTruncMsg(lastMessageText, 32)}</p>
        }
      </div>

    </div>
  )
}

export default Conversation;
