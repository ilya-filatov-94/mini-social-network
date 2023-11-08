import {FC} from 'react';
import styles from './Comments.module.scss';
import {useAppSelector} from '../../../hooks/useTypedRedux';
import {Link} from 'react-router-dom';
import noAvatar from '../../../assets/images/no-avatar.jpg';
import {IComments} from '../../../types/comments';
// import { ReactComponent as SendArrow} from '../../../assets/images/right_arrow.svg';

interface IContentPostProps {
    userId: number;
    postId: number | undefined;
    curTheme: string;
};

const Comments: FC<IContentPostProps> = ({userId, postId, curTheme}) => {

//   const {data: userData, error, isLoading} = useGetUserDataQuery(id as string, {skip: !(userId && postId)});
  console.log('Айдишник пользователя', userId);
  console.log('Айдишник поста под которым остален коммент', postId);
  
  //Временно, нужно написать запрос на бэкенд на получение массива комментов по user.id
  const comments: IComments[] = [];
  const curUser = useAppSelector(state => state.reducerAuth.currentUser);
  

  return (
    <div className={curTheme ==='darkMode'
      ? `${styles.comments} ${styles['theme-dark']}`
      : `${styles.comments} ${styles['theme-light']}`
    }>
        <div className={styles.writeComment}>
            <img 
                className={styles.iconUser}
                src={curUser.profilePic ? curUser.profilePic : noAvatar} 
                alt={`user ${curUser.username}`} 
            />
            <input 
                className={styles.input}
                type="text" 
                placeholder="Напишите комментарий"
            />
            <div className={styles.mobileBtnSend}/>
            <button className={styles.btn}>
                Отправить
            </button>
        </div>
        {comments?.length !== 0 &&
            comments.map(comment => 
            <div className={styles.comment} key={comment.id}>
                <img 
                    className={styles.iconUser}
                    src={comment.profilePic} 
                    alt={`description comment ${comment.id}`} 
                />
                <div className={styles.info}>
                    <Link 
                        className={styles.username}
                        to={`/profile/${comment.refUser}`}
                        replace={true}
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

export default Comments;
