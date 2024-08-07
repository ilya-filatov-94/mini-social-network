import {FC, useRef, SetStateAction, Dispatch} from 'react';
import styles from './Comments.module.scss';
import {useAppSelector, useAppDispatch} from '../../../hooks/useTypedRedux';
import { shallowEqual } from 'react-redux';
import { emitNotification } from '../../../store/notificationSlice';
import {Link} from 'react-router-dom';
import noAvatar from '../../../assets/images/no-avatar.jpg';
import {urlAPIimages} from '../../../env_variables';
import AlertWidget from '../../AlertWidget/AlertWidget';
import {IComments} from '../../../types/comments';
import {
    useGetAllCommentsQuery,
    useAddCommentMutation,
    useDeleteCommentMutation
} from '../../../services/CommentService';
import Loader from '../../Loader/Loader';
import {FetchBaseQueryError} from "@reduxjs/toolkit/query/react";
import MenuComment from '../MenuComment/MenuComment';
import {getRelativeTimeString} from '../../../helpers/dateTimeFormatting';


interface IContentPostProps {
    userId: number;
    postId: number;
    curTheme: string;
    updateCommentCounter: Dispatch<SetStateAction<number>>;
};

const Comments: FC<IContentPostProps> = ({
    userId, 
    postId, 
    curTheme,
    updateCommentCounter
}) => {
  const {data: comments, error: errorGetComments, isLoading: isLoadingAll} = useGetAllCommentsQuery(
    {postId}, {skip: !postId}
  );
  const [addComment, {error: errorAddComment, isLoading: isLoadingAdd}] = useAddCommentMutation();
  const [deleteComment, {error: errorDeleteComment, isLoading: isLoadingDel}] = useDeleteCommentMutation();
  const isFetchBaseQueryErrorType = (error: any): error is FetchBaseQueryError => 'status' in error;
  const curUser = useAppSelector(state => state.reducerAuth.currentUser, shallowEqual);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const dispatch = useAppDispatch();

  async function handleSendComment() {
    if (textareaRef.current) {
      let textPost = textareaRef.current.value;
      if (!textPost) return;
      const newComment: IComments = await addComment({userId: curUser.id, postId, desc: textPost}).unwrap();
      if (newComment) {
        const dataNotification = {
          userId: userId,
          ref: '/comment/' + newComment.id,
          type: 'addedComment',
          isRead: false,
        };
        dispatch(emitNotification(dataNotification));   
      }   
      updateCommentCounter(prev => Number(prev) + 1);
    }
  }

  async function handleDeleteComment(id: number) {
    const idDeletedComment = await deleteComment({postId, id}).unwrap();
    if (idDeletedComment && idDeletedComment !== 0) {
      const dataNotification = {
        userId: userId,
        ref: '/comment/' + idDeletedComment,
        type: 'deletedComment',
      };
      dispatch(emitNotification(dataNotification));  
    }
    updateCommentCounter(prev => prev - 1);
  }
  
  if (isLoadingAll || isLoadingAdd || isLoadingDel) {
    return <Loader />
  }

  if (errorGetComments || errorAddComment || errorDeleteComment) {
    if (isFetchBaseQueryErrorType(errorGetComments)) {
      return (
        <AlertWidget
          addClass={styles.alertStyle}
          error={errorGetComments} 
          errorMessage='Ошибка открытия комментариев!'
        />
      );
    }
    if (isFetchBaseQueryErrorType(errorAddComment)) {
      return (
        <AlertWidget
          addClass={styles.alertStyle}
          error={errorAddComment} 
          errorMessage='Ошибка добавления комментария!'
        />
      );
    }
    if (isFetchBaseQueryErrorType(errorDeleteComment)) {
        return (
          <AlertWidget
            addClass={styles.alertStyle}
            error={errorDeleteComment} 
            errorMessage='Ошибка удаления комментария!'
          />
        );
    }
  }

  return (
    <div className={curTheme ==='darkMode'
      ? `${styles.comments} ${styles['theme-dark']}`
      : `${styles.comments} ${styles['theme-light']}`
    }>
        <div className={styles.writeComment}>
            <img 
                className={styles.iconUser}
                src={curUser.profilePic ? (urlAPIimages + curUser.profilePic) : noAvatar} 
                alt={`user ${curUser.username}`} 
            />
            <textarea
              ref={textareaRef}
              rows={1}
              maxLength={255}
              className={styles.input}
              placeholder="Напишите комментарий"
            />
            <div className={styles.mobileBtnSend} onClick={handleSendComment}/>
            <button className={styles.btn} onClick={handleSendComment}>
              Отправить
            </button>
        </div>

        {(comments && comments?.length !== 0) &&
            comments.map((comment: IComments) => 
            <div className={styles.comment} key={comment.id}>
                <img 
                    className={styles.iconUser}
                    src={comment.profilePic ? (urlAPIimages + comment.profilePic) : noAvatar}
                    alt={`description comment ${comment.id}`} 
                />
                <div className={styles.info}>
                    <div className={styles.ext_info}>
                        <Link 
                            className={styles.username}
                            to={comment.userId !== curUser.id 
                              ? `/profile/${comment.refUser}?id=${curUser.id}` 
                              : `/profile/${comment.refUser}`}
                            replace={true}
                        >
                        <span>{comment.username}</span>
                        </Link>
                        <span className={styles.date}>
                          {getRelativeTimeString(Date.parse(comment.date), 'ru')}
                        </span>
                    </div>
                    <p className={styles.commDesc}>{comment.desc}</p>
                </div>
                <MenuComment
                  idComment={comment.id}
                  deleteComment={handleDeleteComment}
                  curTheme={curTheme}
                />
            </div>
        )}
    </div>
  )
}

export default Comments;
