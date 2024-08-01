import {FC} from 'react';
import styles from './PagePost.module.scss';
import {useParams} from "react-router-dom";
import {useAppSelector} from '../../hooks/useTypedRedux';
import { shallowEqual } from 'react-redux';
import {FetchBaseQueryError} from "@reduxjs/toolkit/query/react";
import Loader from '../../components/Loader/Loader';
import Alert from '@mui/material/Alert';
import Post from '../../components/Post/Post';
import { useGetOnePostQuery } from '../../services/PostService';

const PagePost: FC = () => {
  const {postId} = useParams();
  const curUser = useAppSelector(state => state.reducerAuth.currentUser, shallowEqual);
  const currentTheme = useAppSelector((state) => state.reducerTheme.themeMode, shallowEqual);
  const {
    data: post, 
    error: errorLoad, 
    isLoading: isLoadingPost
  } = useGetOnePostQuery(Number(postId), {skip: !postId});
  const isFetchBaseQueryErrorType = (error: any): error is FetchBaseQueryError => 'status' in error;

  if (isLoadingPost) {
    return <Loader />
  }

  if (errorLoad) {
    if (isFetchBaseQueryErrorType(errorLoad)) {
      return <Alert severity="error" sx={{m: 20}}>Произошла ошибка при загрузке данных! {errorLoad.status}</Alert>
    }
  }

  if (post && !isLoadingPost) {
  return (
    <div className={currentTheme ==='darkMode'
      ? `${styles.container} ${styles['theme-dark']}`
      : `${styles.container} ${styles['theme-light']}`
      }>
        <div className={styles.wrapper}>
          <Post 
            key={post.id} 
            userId={post.user.id!}
            currentUser={curUser.id === post.user.id}
            curUserId={curUser.id}
            post={post}
          />
        </div>
    </div>
  )}
  else return <Alert severity="error" sx={{m: 20}}>{JSON.stringify(errorLoad)}</Alert>
}

export default PagePost;
