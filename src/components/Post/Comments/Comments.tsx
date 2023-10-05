import {FC} from 'react';
import styles from './Comments.module.scss';
import {useAppSelector} from '../../../hooks/useTypedRedux';
import {Link} from 'react-router-dom';
import noAvatar from '../../../assets/images/no-avatar.jpg';
import {IComments} from '../../../types/comments';

import { ReactComponent as SendArrow} from '../../../assets/images/right_arrow.svg';

interface IContentPostProps {
    comments: IComments[] | [];
    curTheme: string;
};


const Comments: FC<IContentPostProps> = ({comments, curTheme}) => {
  const currentUser = useAppSelector(state => state.reducerAuth.currentUser);

  return (
    <div className={curTheme ==='darkMode'
      ? `${styles.comments} ${styles['theme-dark']}`
      : `${styles.comments} ${styles['theme-light']}`
    }>
        <div className={styles.writeComment}>
            <img 
                className={styles.iconUser}
                src={currentUser.profileImg ? currentUser.profileImg : noAvatar} 
                alt={`user ${currentUser.username}`} 
            />
            <input 
                className={styles.input}
                type="text" 
                placeholder="Напишите комментарий"
            />
            <div className={styles.mobileBtnSend}>
                <SendArrow/>
            </div>
            <button
                className={styles.btn}
            >
                Отправить
            </button>
        </div>
        {comments.map(comment => 
            <div className={styles.comment} key={comment.id}>
                <img 
                    className={styles.iconUser}
                    src={comment.profilePicture} 
                    alt={`description comment ${comment.id}`} 
                />
                <div className={styles.info}>
                    <Link 
                        className={styles.username}
                        to={`/profile/${comment.username.replaceAll(' ', '')}`}
                    >
                        <span>{comment.username}</span>
                    </Link>
                    <p className={styles.commDesc}>{comment.desc}</p>
                </div>
                <span className={styles.date}>{comment.date}</span>
            </div>
        )}
    </div>
  )
}

export default Comments
