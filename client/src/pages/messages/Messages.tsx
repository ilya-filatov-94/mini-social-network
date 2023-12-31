import {
  FC,
  useRef,
  useState, 
  ChangeEvent,
  useEffect,
} from 'react';
import styles from './Messages.module.scss';
import {useAppSelector, useAppDispatch} from '../../hooks/useTypedRedux';
import { shallowEqual } from 'react-redux';
import {urlAPIimages} from '../../env_variables';
import noAvatar from '../../assets/images/no-avatar.jpg';
import ArrowBackIosNewOutlinedIcon from '@mui/icons-material/ArrowBackIosNewOutlined';
import { Link, useNavigate } from "react-router-dom";
import PreviewAttach, {TPreviewImg} from './PreviewAttach/PreviewAttach';
import MessageItem from './MessageItem/MessageItem';
import {changeInputMessage, send} from '../../store/messagesSlice';
import {useGetMessagesQuery, useSendMesageMutation} from '../../services/MessengerService';
import LoaderMessenger from '../messenger/LoaderMessenger/LoaderMessenger';
import AlertWidget from '../../components/AlertWidget/AlertWidget';
import {FetchBaseQueryError} from "@reduxjs/toolkit/query/react";
import {getRelativeTimeString} from '../../helpers/dateTimeFormatting';


const Messages: FC = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const curUser = useAppSelector((state) => state.reducerAuth.currentUser,shallowEqual);
  const currentTheme = useAppSelector((state) => state.reducerTheme.themeMode,shallowEqual);
  const currentConversation = useAppSelector(
    (state) => state.reducerConversation.currentConversaton,
    shallowEqual
  );
  const lastMessage = useAppSelector((state) => state.reducerConversation.lastMessage);

  const {
    data: messagesList,
    error: errorGetMessages,
    isLoading: isLoadingMessages,
    refetch,
  } = useGetMessagesQuery(currentConversation.id);
  const [sendMesage] = useSendMesageMutation();
  const isFetchBaseQueryErrorType = (error: any): error is FetchBaseQueryError => "status" in error;

  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const [previewImg, setPreviewImg] = useState<TPreviewImg>();
  const [selectedFile, setSelectedFile] = useState<File>();

  const refMsg = useRef<HTMLDivElement | HTMLParagraphElement>(null);

  useEffect(() => {
    if (messagesList && refMsg.current) {
      refMsg.current.scrollIntoView({ behavior: "smooth", block: "end" });
    }
    refetch();
  }, [messagesList, refMsg, lastMessage, refetch]);

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
    await sendMesage(currentConversation.id).unwrap();
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
            <Link
              className={styles.link}
              to={`/profile/${currentConversation.refUser}?id=${curUser.id}`}
            >
              <h2>{currentConversation.username}</h2>
            </Link>
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

          {messagesList &&
            messagesList.length !== 0 &&
            messagesList.map((message, index) => (
              <MessageItem
                key={message.id}
                refMsg={index === (messagesList.length - 1) ? refMsg : undefined}
                addClass={
                  message.userId === curUser.id
                    ? styles.sender
                    : styles.recipient
                }
                username={message.username!}
                timeMsg={getRelativeTimeString(
                  new Date(message.createdAt!),
                  "ru"
                )}
                textMsg={message.text}
                imgMsg={message.file}
              />
            ))}

          {messagesList && messagesList.length === 0 && (
            <p ref={refMsg} className={styles.emptyConversation}>
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
  
