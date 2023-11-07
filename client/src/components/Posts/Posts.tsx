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
};

const Posts: FC<IPostsProps> = ({userId, currentUser}) => {

  const {data: posts, error, isLoading} = useGetAllPostsQuery(userId);
  const isFetchBaseQueryErrorType = (error: any): error is FetchBaseQueryError => 'status' in error;

  if (isLoading) {
    return <Loader />
  }

  if (error) {
    if (isFetchBaseQueryErrorType(error)) {
      return <Alert severity="error" sx={{m: 20}}>Произошла ошибка при загрузке данных! {error.status}</Alert>
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
          post={post} 
        />
      )}
    </div>
  )
}

export default Posts;
