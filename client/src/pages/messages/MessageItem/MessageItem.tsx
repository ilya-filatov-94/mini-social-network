import {FC, MutableRefObject, memo} from 'react';
import styles from './MessageItem.module.scss';
import {urlAPIimages} from '../../../env_variables';

interface IMessageItemProps {
  addClass?: string;
  username: string;
  timeMsg: string;
  textMsg?: string;
  imgMsg?: string;
  refMsg?: MutableRefObject<null | HTMLDivElement>;
}

const MessageItem: FC<IMessageItemProps> = memo(({
  addClass,
  username,
  timeMsg,
  textMsg,
  imgMsg,
  refMsg
}) => {
  return (
    <div className={`${styles.messageItem} ${addClass}`} ref={refMsg}>
      <div className={styles.messageInfo}>
        <p className={styles.username}>{username}</p>
        <p className={styles.time}>{timeMsg}</p>
      </div>
      <div className={styles.messageContent}>
        {imgMsg &&
          <img
            className={styles.img}
            src={urlAPIimages + urlAPIimages}
            alt="Картинка к сообщению"
          />
        }
        <p className={styles.text}>{textMsg}</p>
      </div>
    </div>
  )
})

export default MessageItem;
