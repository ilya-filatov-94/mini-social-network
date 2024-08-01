import {FC, MutableRefObject, memo, useEffect, LegacyRef, useCallback} from 'react';
import styles from './MessageItem.module.scss';
import {urlAPIimages} from '../../../env_variables';
import {useInView} from 'react-intersection-observer';
import { mergeRefs } from '../../../helpers/mergeRefs';
import { 
  DoneOutlined as DoneOutlinedIcon,
  DoneAllOutlined as DoneAllOutlinedIcon
} from '@mui/icons-material';


interface IMessageItemProps {
  id?: number;
  addClass?: string;
  username: string;
  userId: number;
  curUserId: number;
  isLoadingMessages: boolean;
  timeMsg: string;
  textMsg?: string;
  imgMsg?: string;
  isMsgToScroll?: boolean;
  refMsg?: MutableRefObject<Element | null | undefined>;
  isRead?: boolean;
  isDelivery?: boolean;
  changesMessageStatus: (userId: number, idMsg: number, isRead?: boolean) => void;
  refLastMsg?: LegacyRef<HTMLDivElement>;
}

const MessageItem: FC<IMessageItemProps> = memo(({
  id,
  addClass,
  username,
  userId,
  curUserId,
  isLoadingMessages,
  timeMsg,
  textMsg,
  imgMsg,
  refMsg,
  isRead,
  changesMessageStatus,
  isDelivery,
  refLastMsg
}) => {

  const {ref: refObserver, inView} = useInView({
    threshold: 0.7,
    triggerOnce: true,
  });

  useEffect(() => {
    if (inView && !isLoadingMessages && userId !== curUserId) {
      const timer = setTimeout(() => {
        changesMessageStatus(userId, id!, isRead);
      }, 200);
      return () => clearTimeout(timer);
    }
  }, [inView, isLoadingMessages, changesMessageStatus, curUserId, id, isRead, userId]);

  return (
    <div 
      className={`${styles.messageItem} ${addClass}`}
      ref={refLastMsg}
    >
      <div className={styles.messageInfo} ref={mergeRefs(refMsg, refObserver)}>
        <p className={styles.username}>{username}</p>
        <div className={styles.wrapperDateMsg}>
            <div className={(userId !== curUserId && !isRead && inView) ? styles.msgIsRead : styles.msgStatus} />
            <p className={styles.time}>{timeMsg}</p>
        </div>
      </div>
      <div className={styles.messageContent}>
        {imgMsg &&
          <img
            className={styles.img}
            src={urlAPIimages + imgMsg}
            alt="Картинка к сообщению"
          />
        }
        <p className={styles.text}>{textMsg}</p>
      </div>
      {(userId === curUserId && isDelivery && !isRead) && (
        <div className={styles.wrapperMsgStatus}>
          <DoneOutlinedIcon className={styles.msgStatusIcon} />
        </div>
      )}
      {(userId === curUserId && isDelivery && isRead) && (
        <div className={styles.wrapperMsgStatus}>
          <DoneAllOutlinedIcon className={styles.msgStatusIcon} />
        </div>
      )}
    </div>
  )
})

export default MessageItem;
