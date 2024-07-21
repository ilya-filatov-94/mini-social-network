import {
  FC,
  useRef,
  useState, 
  ChangeEvent,
  useEffect,
  RefObject,
  useCallback
} from 'react';
import styles from './Messages.module.scss';
import {useAppSelector, useAppDispatch} from '../../hooks/useTypedRedux';
import { shallowEqual } from 'react-redux';
import {urlAPIimages} from '../../env_variables';
import noAvatar from '../../assets/images/no-avatar.jpg';
import { ArrowBackIosNewOutlined as ArrowBackIosNewOutlinedIcon } from '@mui/icons-material';
import { Link, useNavigate } from "react-router-dom";
import PreviewAttach, {TPreviewImg} from './PreviewAttach/PreviewAttach';
import MessageItem from './MessageItem/MessageItem';
import {
  changeInputMessage, 
  send, 
  updateUnreadMsgsList, 
  changeMsgsReadStatus
} from '../../store/messagesSlice';
import {useGetMessagesQuery} from '../../services/MessengerService';
import LoaderMessenger from '../messenger/LoaderMessenger/LoaderMessenger';
import AlertWidget from '../../components/AlertWidget/AlertWidget';
import {FetchBaseQueryError} from "@reduxjs/toolkit/query/react";
import {getRelativeTimeString, getCurrentDateTimeString} from '../../helpers/dateTimeFormatting';
import { IMessage } from '../../types/messenger';

const Messages: FC = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const curUser = useAppSelector((state) => state.reducerAuth.currentUser,shallowEqual);
  const currentTheme = useAppSelector((state) => state.reducerTheme.themeMode,shallowEqual);
  const currentConversation = useAppSelector(
    (state) => state.reducerConversation.currentConversaton,
    shallowEqual
  );
  const unReadMessagesState = useAppSelector(state => state.reducerMessages.unreadMsgsList, shallowEqual);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const [previewImg, setPreviewImg] = useState<TPreviewImg>();
  const [selectedFile, setSelectedFile] = useState<File>();
  const lastMessage = useAppSelector((state) => state.reducerConversation.lastMessage, shallowEqual);
  const readMsgs = useAppSelector((state) => state.reducerMessages.readMsgsFromServer, shallowEqual);
  const sentMsg = useRef<Omit<IMessage, "isRead" | "id">>();

  const [messages, setMessages] = useState<IMessage[]>([]);
  const {
    data: messagesList,
    error: errorGetMessages,
    isLoading: isLoadingMessages,
    refetch
  } = useGetMessagesQuery(currentConversation.id, {skip: !currentConversation.id});
  const isFetchBaseQueryErrorType = (error: any): error is FetchBaseQueryError => "status" in error;
  const refMsg = useRef<HTMLDivElement | HTMLParagraphElement>(null);
  const refLastMsg = useRef<HTMLDivElement>(null);
  const idFirstUnreadMsg = messagesList?.find(({userId, isRead}) => !isRead && userId !== curUser.id)?.id || 0;
  const firstOpen = useRef<boolean>(false);
  const timeoutId = useRef<ReturnType<typeof setTimeout>>();
  let firstNotReadMsg: RefObject<HTMLDivElement | HTMLParagraphElement>;
  const readStatusMessages = useRef<Set<number>>(new Set());

  useEffect(() => {
    const changeMsgs = !messages?.length && !!messagesList?.length;
    if (changeMsgs) refetch();
  // eslint-disable-next-line
  }, []);

  useEffect(() => {
    if (!!messages?.length && readMsgs.userId !== curUser.id) {
      const objReadMsgs: Record<string, boolean> = readMsgs.ids.reduce((result, curr) => {
        (result as Record<string, boolean>)[String(curr)] = true;
        return result;
      }, {});
      setMessages(prev => prev.map(msg => (objReadMsgs[msg.id!] ? { ...msg, isRead: true } : msg)));
    }
  }, [readMsgs, messages?.length, curUser.id]);

  useEffect(() => {
    if (!!messagesList?.length && messages.length === 0) {
      setMessages(messagesList);
    }
    if (!firstOpen.current) {
      if (idFirstUnreadMsg === 0 && refLastMsg.current) {
        refLastMsg.current.scrollIntoView({ block: "end" });
        firstOpen.current = true;
      }
      if (idFirstUnreadMsg !== 0 && refMsg.current) {
        refMsg.current.scrollIntoView({ block: "end" });
        firstOpen.current = true;
      }
    }
    if (lastMessage.userId === curUser.id && refLastMsg.current) {
      refLastMsg.current.scrollIntoView({ block: "end" });  
    }
  },
  [
    messagesList,
    messages,
    currentConversation.id,
    curUser.id,
    idFirstUnreadMsg,
    lastMessage.userId
  ]);

  useEffect(() => {
    if (!!messagesList?.length && lastMessage.userId !== curUser.id && messages.length !== 0) {
      setMessages(prev => [...prev, lastMessage]);
    }
    if (!!messagesList?.length && lastMessage.userId === curUser.id && sentMsg.current && messages.length !== 0) {
      const newLastMsg = {...sentMsg.current, ...lastMessage};
      setMessages(prev => [...prev, newLastMsg]);
    }
  // eslint-disable-next-line
  }, [lastMessage]);

  const changesMessageStatus = useCallback((userId: number, idMessage?: number, isRead?: boolean) => {
    if (readStatusMessages.current && !!messagesList?.length) {
      clearTimeout(timeoutId.current);
      if (idMessage && userId !== curUser.id && idMessage >= idFirstUnreadMsg! && !isRead) {
        readStatusMessages.current.add(idMessage);
        const counterNotReadMsgs = unReadMessagesState[currentConversation.id];
        const readingMsgs = readStatusMessages.current.size;
        dispatch(updateUnreadMsgsList({[currentConversation.id]: counterNotReadMsgs - readingMsgs || 0 }));
        setMessages(prev => prev.map(msg => (readStatusMessages.current.has(msg.id!) ? { ...msg, isRead: true } : msg)));
      }
      timeoutId.current = setTimeout(() => {
        if (readStatusMessages.current.size !== 0) {
          const arrayReadMessages = Array.from(readStatusMessages.current);
          dispatch(changeMsgsReadStatus({
            ids: arrayReadMessages,
            conversationId: currentConversation.id,
            userId: currentConversation.memberId,
          }));
          readStatusMessages.current.clear();
        }
      }, 500);
    }
  // eslint-disable-next-line
  }, [messagesList, readStatusMessages]);

  function handleAttachImage(event: ChangeEvent<HTMLInputElement>) {
    if (event.target.files) {
      let file = event.target.files[0];
      if (!file.type.match("image")) return;
      setSelectedFile(file);
      const reader = new FileReader();
      reader.onloadend = () => setPreviewImg(reader.result);
      reader.readAsDataURL(file);
    }
  }

  function removeAttachImage(event: MouseEvent | PointerEvent) {
    event.stopPropagation();
    event.preventDefault();
    setSelectedFile(undefined);
    setPreviewImg(null);
  }

  async function handleSend() {
    if (!currentConversation || !curUser) return;
    let textMessage;
    let notEmptyText;
    if (textareaRef.current) {
      textMessage = textareaRef.current.value;
      notEmptyText = /\S/ig.test(textMessage);
      textareaRef.current.value = "";
    }
    if (!notEmptyText && !selectedFile) return;
    dispatch(
      changeInputMessage({
        conversationId: currentConversation.id,
        userId: currentConversation.memberId,
        username: curUser.username,
        text: textMessage,
        file: selectedFile ? URL.createObjectURL(selectedFile) : "",
        mimeTypeAttach: selectedFile?.type,
        isRead: false,
      })
    );
    dispatch(send());
    setSelectedFile(undefined);
    setPreviewImg(null);
    const newDate = getCurrentDateTimeString();
    const newMsg = {
      conversationId: currentConversation.id,
      userId: curUser.id,
      username: curUser.username,
      text: textMessage,
      file: selectedFile ? URL.createObjectURL(selectedFile) : "",
      mimeTypeAttach: selectedFile?.type,
      isRead: false,
      createdAt: newDate
    };
    sentMsg.current = newMsg;
  }

  function setRef(isSender: boolean, statusRead: boolean) {
    if (!isSender && !statusRead && !firstNotReadMsg) {
      firstNotReadMsg = refMsg;
      return refMsg;
    }
  }

  if (errorGetMessages) {
    if (isFetchBaseQueryErrorType(errorGetMessages)) {
      return (
        <AlertWidget
          error={errorGetMessages}
          errorMessage="Ошибка загрузки сообщений"
        />
      );
    }
  }

  return (
    <div
      className={`${styles.container} ${
        currentTheme === "darkMode"
          ? styles["theme-dark"]
          : styles["theme-light"]
      }`}
    >
      <div className={styles.wrapper}>
        <div className={styles.topBar}>
          <div className={styles.backBtn} onClick={() => navigate(-1)}>
            <ArrowBackIosNewOutlinedIcon />
            <p>Назад</p>
          </div>
          <div className={styles.infoConversation}>
            <div className={styles.wrapperHeader}>
              <Link
                className={styles.link}
                to={`/profile/${currentConversation.refUser}?id=${curUser.id}`}
              >
                <h2>{currentConversation.username}</h2>
              </Link>
              {(unReadMessagesState[currentConversation.id] > 0) &&
                <p className={styles.counterMsg}>
                  {unReadMessagesState[currentConversation.id]}
                </p>
              }
            </div>
            <p>{currentConversation.status}</p>
          </div>
          <img
            className={styles.avatar}
            src={
              currentConversation.profilePic
                ? urlAPIimages + currentConversation.profilePic
                : noAvatar
            }
            alt={`${currentConversation.username} avatar`}
          />
        </div>

        <div className={styles.listMessages}>
          {isLoadingMessages && <LoaderMessenger />}

          {(!!messages?.length && messages?.length > 0) &&
            messages.map((message, index) => (
              <MessageItem
                key={message.id}
                id={message.id}
                refMsg={setRef(
                  message.userId === curUser.id, 
                  message.isRead
                )}
                addClass={
                  message.userId === curUser.id
                    ? styles.sender
                    : styles.recipient
                }
                username={message.username! + ' ' + message.id}
                userId={message.userId}
                curUserId={curUser.id}
                isLoadingMessages={isLoadingMessages}
                timeMsg={getRelativeTimeString(
                  Date.parse(message.createdAt!),
                  "ru"
                )}
                textMsg={message.text}
                imgMsg={message.file}
                isRead={message.isRead}
                changesMessageStatus={changesMessageStatus}
                isDelivery={message.isDelivery}
                refLastMsg={index === (messages.length - 1) ? refLastMsg : undefined}
              />
            ))}

          {!!messages?.length && messages.length === 0 && (
            <p className={styles.emptyConversation}>
              Сообщений пока нет
            </p>
          )}
        </div>

        <div className={styles.bottomBar}>
          <textarea
            ref={textareaRef}
            rows={2}
            maxLength={255}
            className={styles.input}
            placeholder={"Сообщение..."}
          />
          <div className={styles.send}>
            {!previewImg && (
              <input
                onChange={handleAttachImage}
                className={styles.fileInput}
                type="file"
                accept=".jpeg, .jpg, .png"
                id="updateFile"
              />
            )}
            <label htmlFor="updateFile">
              <PreviewAttach
                dataImg={previewImg}
                curTheme={currentTheme}
                remove={removeAttachImage}
                previewAttach="img"
              />
            </label>
            <div className={styles.mobileBtnSend} onClick={handleSend} />
            <button className={styles.btn} onClick={handleSend}>
              Отправить
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Messages;
  
