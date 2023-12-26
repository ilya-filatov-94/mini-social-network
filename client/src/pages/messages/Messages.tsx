import {
  FC,
  useRef,
  useState, 
  ChangeEvent,
} from 'react';
import styles from './Messages.module.scss';
import {useAppSelector, useAppDispatch} from '../../hooks/useTypedRedux';
import {urlAPIimages} from '../../env_variables';
import noAvatar from '../../assets/images/no-avatar.jpg';
import ArrowBackIosNewOutlinedIcon from '@mui/icons-material/ArrowBackIosNewOutlined';
import { Link, useNavigate } from "react-router-dom";
import PreviewAttach from './PreviewAttach/PreviewAttach';
import {TPreviewImg} from './PreviewAttach/PreviewAttach';
import MessageItem from './MessageItem/MessageItem';
import {send} from '../../store/webSocketSlice';
import {changeInputMessage} from '../../store/messagesSlice';
import {useGetMessagesQuery} from '../../services/MessengerService';
import Loader from '../../components/Loader/Loader';
import Alert from '@mui/material/Alert';
import {FetchBaseQueryError} from "@reduxjs/toolkit/query/react";
import {getRelativeTimeString} from '../../helpers/dateTimeFormatting';



const Messages: FC = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const curUser = useAppSelector(state => state.reducerAuth.currentUser);
  const currentTheme = useAppSelector(state => state.reducerTheme.themeMode);
  const currentConversation = useAppSelector(state => state.reducerMessages.currentConversaton);

  const {
    data: messagesList, 
    error: errorGetMessages, 
    isLoading: isLoadingMessages
  } = useGetMessagesQuery(currentConversation.id);
  const isFetchBaseQueryErrorType = (error: any): error is FetchBaseQueryError => 'status' in error;

  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const [previewImg, setPreviewImg] = useState<TPreviewImg>();
  const [selectedFile, setSelectedFile] = useState<File>();


  function handleAttachImage(event: ChangeEvent<HTMLInputElement>) {
    if (event.target.files) {
      let file = event.target.files[0];
      if (!file.type.match('image')) return;
      setSelectedFile(file);

      const reader = new FileReader();
      reader.onloadend = () => setPreviewImg(reader.result)
      reader.readAsDataURL(file);
    }
  }

  function removeAttachImage(event: MouseEvent | PointerEvent) {
    event.stopPropagation();
    event.preventDefault();
    setSelectedFile(undefined);
    setPreviewImg(null);
  }

  function handleSend() {
    let textMessage;
    let notEmptyText;
    if (textareaRef.current) {
      textMessage = textareaRef.current.value;
      notEmptyText = /\S/ig.test(textMessage);
      textareaRef.current.value = '';
    }
    if (!notEmptyText && !selectedFile) return;
    dispatch(changeInputMessage({
      conversationId: 1,
      userId: curUser.id,
      text: textMessage,
      file: selectedFile ? URL.createObjectURL(selectedFile) : '',
      isRead: false,
    }));
    dispatch(send());
    setSelectedFile(undefined);
    setPreviewImg(null);
  }

  if (errorGetMessages) {
    if (isFetchBaseQueryErrorType(errorGetMessages)) {
      return ( 
      <Alert severity="error" sx={{m: 20}}>
        Ошибка при поиске собеседника! {errorGetMessages.status}
      </Alert>);
    }
  }

  return (
    <div className={`${styles.container}
    ${currentTheme ==='darkMode' 
    ? styles['theme-dark']
    : styles['theme-light']
    }`}>
      <div className={styles.mainWrapper}>
        <div className={`${styles.wrapper} ${styles.headerWrapper}`}>
          <div className={styles.backBtn} onClick={() => navigate(-1)}>
            <ArrowBackIosNewOutlinedIcon />
            <p>Назад</p>
          </div>
          <div className={styles.infoConversation}>
            <Link className={styles.link} to={`/profile/${currentConversation.refUser}?id=${curUser.id}`}>
            <h2>{currentConversation.username}</h2>
            </Link>
            <p>{currentConversation.status}</p>
          </div>
          <img
            className={styles.avatar}
            src={currentConversation.profilePic ? urlAPIimages + currentConversation.profilePic : noAvatar}
            alt={`${currentConversation.username} avatar`}
          />
        </div>

        <div className={`${styles.wrapper} ${styles.listMessages}`}>
          {isLoadingMessages && <Loader />}

          {(messagesList && messagesList.length !== 0) &&
            messagesList.map(message =>
              <MessageItem 
                addClass={message.userId === curUser.id 
                  ? styles.sender 
                  : styles.recipient
                  }
                username={message.username!}
                timeMsg={getRelativeTimeString(new Date(message.createdAt!), 'ru')}
                textMsg={message.text}
                imgMsg={message.file}
              />
            )
          }

          {(messagesList && messagesList.length === 0) &&
            <p className={styles.emptyConversation}>Сообщений пока нет</p>
          }
          
        </div>

        <div className={`${styles.wrapper} ${styles.bottomBar}`}>
          <textarea
            ref={textareaRef}
            rows={2}
            maxLength={255}
            className={styles.input}
            placeholder={"Сообщение..."}
          />
          <div className={styles.send}>
            <input
              onChange={handleAttachImage}
              className={styles.fileInput}
              type="file"
              accept=".jpeg, .jpg, .png"
              id="updateFile"
            />
            <label htmlFor="updateFile">
              <PreviewAttach 
                dataImg={previewImg}
                curTheme={currentTheme}
                remove={removeAttachImage}
                previewAttach='img'
              />
            </label>
            <div className={styles.mobileBtnSend} onClick={handleSend}/>
            <button className={styles.btn} onClick={handleSend}>
              Отправить
            </button>
          </div>
        </div>

      </div>
    </div>
  )
}

export default Messages;
