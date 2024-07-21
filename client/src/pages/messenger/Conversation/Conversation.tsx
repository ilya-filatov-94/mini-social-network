import {FC, memo} from 'react';
import styles from './Conversation.module.scss';
import noAvatar from '../../../assets/images/no-avatar.jpg';
import {urlAPIimages} from '../../../env_variables';
import {useNavigate} from "react-router-dom";
import {useAppDispatch} from '../../../hooks/useTypedRedux';
import {setCurrentConversationData} from '../../../store/conversationSlice';
import {IConversation} from '../../../types/messenger';
import {FetchBaseQueryError} from "@reduxjs/toolkit/query/react";

export interface IPropsConversation {
  id?: number;
  curUserId: number;
  memberId: number;
  lastMessageText?: string;
  username: string;
  profilePic: string | undefined;
  status?: string;
  addClass?: string;
  openConversation: (params: any) => any;
  counterUnreadMsg?: number;
}

const Conversation: FC<IPropsConversation> = memo(({
  lastMessageText,
  curUserId,
  memberId,
  username,
  profilePic,
  status,
  addClass,
  openConversation,
  counterUnreadMsg,
}) => {

  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const isFetchBaseQueryErrorType = (error: any): error is FetchBaseQueryError => 'status' in error;

  function clickConversation() {
    openConversation({
      userId: curUserId, 
      memberId: memberId
    })
    .unwrap()
    .then((conversationData: IConversation) => {  
      dispatch(setCurrentConversationData({
        id: conversationData.id,
        memberId: conversationData.memberId,
        lastMessageId: conversationData.lastMessageId,
        lastMessageText: conversationData.lastMessageText,
        username: conversationData.username,
        profilePic: conversationData.profilePic,
        refUser: conversationData.refUser,
        status: conversationData.status
      }));
      navigate(`/messages/${conversationData.id}`);
    })
    .catch((error: unknown) => {
        if (isFetchBaseQueryErrorType(error)) {
          console.error(error);
        }
    });
  }

  function previewTruncMsg(text: string, maxlength: number) {
    return (text.length > maxlength) ?
        text.slice(0, maxlength - 1) + '…' : text;
  }

  return (
    <div 
      className={`${styles.wrapperConversation} ${addClass ? addClass : ''}`} 
      onClick={clickConversation}
    >
      <div className={styles.userItem}>
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
      {(!!counterUnreadMsg && counterUnreadMsg > 0) &&
        <div className={styles.counterMsg}>
          {counterUnreadMsg}
        </div>
      }
    </div>
  )
});

export default Conversation;