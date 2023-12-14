import {FC} from 'react';
import styles from './Messages.module.scss';
import {useAppSelector} from '../../hooks/useTypedRedux';
import {urlAPIimages} from '../../env_variables';
import noAvatar from '../../assets/images/no-avatar.jpg';
import ArrowBackIosNewOutlinedIcon from '@mui/icons-material/ArrowBackIosNewOutlined';
import { Link, useNavigate } from "react-router-dom";


//Mock Данные диалога
const MockConversation = {
  username: 'John Doe',
  avatar: '',
  refUser: 'JohnDoe21',
  refDialog: '1',
  lastMessage: 'Привет, Джон, давно не виделись, как твои дела?',
  status: 'online',
}

const Messages: FC = () => {
  const curUser = useAppSelector(state => state.reducerAuth.currentUser);
  const currentTheme = useAppSelector(state => state.reducerTheme.themeMode);
  const navigate = useNavigate();

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

          <h2>Сообщения</h2>



        </div>

        <div className={`${styles.wrapper} ${styles.bottomBar}`}>
          <h2>Отправка сообщения</h2>
        </div>
      </div>
    </div>
  )
}

export default Messages;
