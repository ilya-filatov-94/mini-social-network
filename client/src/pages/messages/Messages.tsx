import {
  FC,
  useRef,
  useState, 
  useEffect,
  ChangeEvent,
} from 'react';
import styles from './Messages.module.scss';
import {useAppSelector} from '../../hooks/useTypedRedux';
import {urlAPIimages} from '../../env_variables';
import noAvatar from '../../assets/images/no-avatar.jpg';
import ArrowBackIosNewOutlinedIcon from '@mui/icons-material/ArrowBackIosNewOutlined';
import { Link, useNavigate } from "react-router-dom";
import PreviewAttach from './PreviewAttach/PreviewAttach';
import {TPreviewImg} from './PreviewAttach/PreviewAttach';
import MessageItem from './MessageItem/MessageItem';

import {io, Socket} from 'socket.io-client';
import {API_SocketURL} from '../../env_variables';

//Mock Данные диалога
import photo from '../../assets/images/bg-for-login.jpeg';
const MockConversation = {
  username: 'John Doe',
  avatar: '',
  refUser: 'JohnDoe21',
  refDialog: '1',
  lastMessage: 'Привет, Джон, давно не виделись, как твои дела?',
  status: 'online',
}

const MockMessage = {
  username: 'John Doe',
  timeMsg: '13 мин. назад',
  textMsg: 'Привет, Джон, давно не виделись, как твои дела?',
  imgMsg: '',
}

const Messages: FC = () => {
  const curUser = useAppSelector(state => state.reducerAuth.currentUser);
  const currentTheme = useAppSelector(state => state.reducerTheme.themeMode);
  const navigate = useNavigate();
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const [previewImg, setPreviewImg] = useState<TPreviewImg>();
  const [selectedFile, setSelectedFile] = useState<File>();


  const socketRef = useRef<Socket>(io(API_SocketURL));

  useEffect(() => {
    socketRef.current.emit('addUser', curUser.id);

    socketRef.current.on("getUsers", (userId) => {
      console.log('Пользователь подключен', userId);
    });
  }, [curUser]);



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
            <Link className={styles.link} to={`/profile/${MockConversation.refUser}?id=${curUser.id}`}>
            <h2>{MockConversation.username}</h2>
            </Link>
            <p>{MockConversation.status}</p>
          </div>
          <img
            className={styles.avatar}
            src={MockConversation.avatar ? urlAPIimages + MockConversation.avatar : noAvatar}
            alt={`${MockConversation.username} avatar`}
          />
        </div>

        <div className={`${styles.wrapper} ${styles.listMessages}`}>

          <MessageItem 
            addClass={styles.recipient}
            username={MockMessage.username}
            timeMsg={MockMessage.timeMsg}
            textMsg='Привет!'
          />

          <MessageItem 
            addClass={styles.sender}
            username={MockMessage.username}
            timeMsg={MockMessage.timeMsg}
            textMsg={MockMessage.textMsg}
            // imgMsg={photo}
          />

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
