import {FC} from 'react';
import styles from './MessageItem.module.scss';
import {urlAPIimages} from '../../../env_variables';

interface IMessageItemProps {
  addClass?: string;
  username: string;
  timeMsg: string;
  textMsg?: string;
  imgMsg?: string;
}

const MessageItem: FC<IMessageItemProps> = ({
  addClass,
  username,
  timeMsg,
  textMsg,
  imgMsg
}) => {
  return (
    <div className={`${styles.messageItem} ${addClass}`}>
      <div className={styles.messageInfo}>
        <p className={styles.username}>{username}</p>
        <p className={styles.time}>{timeMsg}</p>
      </div>
      <div className={styles.messageContent}>
        {imgMsg &&
          <img
            className={styles.img}
            src={imgMsg}
            alt="Картинка к сообщению"
          />
        }
        <p className={styles.text}>{textMsg}</p>
      </div>
    </div>
  )
}

export default MessageItem;
