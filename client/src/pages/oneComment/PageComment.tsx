import {FC} from 'react';
import styles from './PageComment.module.scss';
import {useParams} from "react-router-dom";
import {useAppSelector} from '../../hooks/useTypedRedux';
import { shallowEqual } from 'react-redux';
import {FetchBaseQueryError} from "@reduxjs/toolkit/query/react";
import Loader from '../../components/Loader/Loader';
import Alert from '@mui/material/Alert';
import { useGetOneCommentQuery } from '../../services/CommentService';
import {Link} from 'react-router-dom';
import noAvatar from '../../assets/images/no-avatar.jpg';
import {urlAPIimages} from '../../env_variables';
import {getRelativeTimeString} from '../../helpers/dateTimeFormatting';

const PageComment:FC = () => {
  const {comId} = useParams();
  const curUser = useAppSelector(state => state.reducerAuth.currentUser, shallowEqual);
  const currentTheme = useAppSelector((state) => state.reducerTheme.themeMode, shallowEqual);
  const {
    data: comment, 
    error: errorLoad, 
    isLoading: isLoadingComment
  } = useGetOneCommentQuery(Number(comId), {skip: !comId});
  const isFetchBaseQueryErrorType = (error: any): error is FetchBaseQueryError => 'status' in error;

  if (isLoadingComment) {
    return <Loader />
  }

  if (errorLoad) {
    if (isFetchBaseQueryErrorType(errorLoad)) {
      return <Alert severity="error" sx={{m: 20}}>Произошла ошибка при загрузке данных! {errorLoad.status}</Alert>
    }
  }

  if (comment && !isLoadingComment) {
    return (
      <div className={currentTheme ==='darkMode'
        ? `${styles.container} ${styles['theme-dark']}`
        : `${styles.container} ${styles['theme-light']}`
        }>
          <div className={styles.wrapper}>
            <div>
              <span className={styles.commDesc}>Комментарий к </span>
              <Link to={`/post/${comment.postId}`} className={styles.link}>посту</Link>
            </div>
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
            </div>
          </div>
      </div>
    )}
    else return <Alert severity="error" sx={{m: 20}}>{JSON.stringify(errorLoad)}</Alert>
}

export default PageComment;
