import {FC} from 'react';
import styles from './Posts.module.scss';
import Post from '../Post/Post';
import {IPostData} from '../../types/posts';
import {useGetAllPostsQuery} from '../../services/PostService';
import Loader from '../Loader/Loader';
import Alert from '@mui/material/Alert';
import { 
  FetchBaseQueryError,
} from "@reduxjs/toolkit/query/react";


interface IPostsProps {
  userId: number;
  currentUser: boolean;
  curUserId: number;
};

const Posts: FC<IPostsProps> = ({userId, currentUser, curUserId}) => {

  const {
    data: posts, 
    error: errorLoad, 
    isLoading: isLoadingPosts
  } = useGetAllPostsQuery(userId);
  const isFetchBaseQueryErrorType = (error: any): error is FetchBaseQueryError => 'status' in error;

  if (isLoadingPosts) {
    return <Loader />
  }

  if (errorLoad) {
    if (isFetchBaseQueryErrorType(errorLoad)) {
      return <Alert severity="error" sx={{m: 20}}>Произошла ошибка при загрузке данных! {errorLoad.status}</Alert>
    }
  }

  return (
    <div className={styles.posts}>
      {(posts && posts?.length !== 0) &&
        posts.map((post: IPostData) => 
        <Post 
          key={post.id} 
          userId={userId}
          currentUser={currentUser}
          curUserId={curUserId}
          post={post}
        />
      )}
    </div>
  )
}

export default Posts;
