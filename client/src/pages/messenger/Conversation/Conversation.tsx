import {FC} from 'react';
import styles from './Conversation.module.scss';
import noAvatar from '../../../assets/images/no-avatar.jpg';
import {urlAPIimages} from '../../../env_variables';
import {useNavigate} from "react-router-dom";

{/* <Link className={styles.link} to={`/messages/${refUser}/${refDialog}`}> */}

interface IUserItemProps {
    username: string;
    avatar: string | undefined;
    refUser: string;
    refDialog: string;
    lastMessage?: string;
    status: string;
    addClass?: string;
}

const Conversation: FC<IUserItemProps> = ({
    username,
    avatar,
    refUser,
    refDialog,
    lastMessage,
    status,
    addClass,
}) => {

  const navigate = useNavigate();

  function openConversation() {
    navigate('/messages');
  }

  function previewTruncMsg(text: string, maxlength: number) {
    return (text.length > maxlength) ?
        text.slice(0, maxlength - 1) + '…' : text;
  }

  return (
    <div 
      onClick={openConversation}
      className={`${styles.userItem} ${addClass ? addClass : ''}`}
    >
      <img
        className={styles.avatar}
        src={avatar ? urlAPIimages + avatar : noAvatar}
        alt={`${username} avatar`}
      />
      <div className={styles.infoUser}>
        <p className={styles.username}>{username}</p>
        <p className={styles.infoText}>{status}</p>
        {lastMessage &&
          <p className={styles.previewMsg}>{previewTruncMsg(lastMessage, 32)}</p>
        }
      </div>

    </div>
  )
}

export default Conversation;
