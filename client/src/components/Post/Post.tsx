import {FC, useState} from 'react';
import styles from './Post.module.scss';

import {useAppSelector} from '../../hooks/useTypedRedux';
import { shallowEqual } from 'react-redux';
import InfoAuthorOfPost from './InfoAuthorOfPost/InfoAuthorOfPost';
import ContentPost from './ContentPost/ContentPost';
import EditPost from './EditPost/EditPost';
import Comments from './Comments/Comments';
import {IPostData} from '../../types/posts';
import {useDeletePostMutation} from '../../services/PostService';
import Alert from '@mui/material/Alert';
import { 
  FetchBaseQueryError,
} from "@reduxjs/toolkit/query/react";

interface IPostsProps {
  currentUser: boolean;
  userId: number;
  curUserId: number;
  post: IPostData;
};

const Post: FC<IPostsProps> = ({
  post, 
  currentUser,
  userId,
  curUserId
}) => {

  const currentTheme = useAppSelector(state => state.reducerTheme.themeMode, shallowEqual);
  const [postIsEdited, editPost] = useState<boolean>(false);
  const [deletePost, {error}] = useDeletePostMutation();
  const isFetchBaseQueryErrorType = (error: any): error is FetchBaseQueryError => 'status' in error;
  const [isCommentOpen, setCommentOpen] = useState<boolean>(false);
  const [numberOfComments, updateCommentCounter] = useState<number>(post.counterComments || 0);

  async function deletePostFn() {
    if (post.id) {
      await deletePost(post.id).unwrap();
    }
  }

  if (error) {
    if (isFetchBaseQueryErrorType(error)) {
      return <Alert severity="error" sx={{m: 20}}>Произошла ошибка при загрузке данных! {error.status}</Alert>
    }
  }

  return (
    <div className={currentTheme ==='darkMode'
      ? `${styles.post} ${styles['theme-dark']}`
      : `${styles.post} ${styles['theme-light']}`
    }>
      <div className={styles.container}>
        <InfoAuthorOfPost 
          post={post} 
          currentUser={currentUser}
          curUserId={curUserId}
          curTheme={currentTheme}
          editPost={editPost}
          deletePost={deletePostFn}
        />

        {!postIsEdited &&
          <ContentPost 
            post={post}
            curTheme={currentTheme}
            numberOfComments={numberOfComments}
            isCommentOpen={isCommentOpen}
            setCommentOpen={setCommentOpen}
          />
        }

        {postIsEdited &&
          <EditPost 
            post={post}
            editPost={editPost}
            curTheme={currentTheme}
          />
        }

        {isCommentOpen && 
          <Comments 
            userId={userId} 
            postId={post.id!}
            curTheme={currentTheme}
            updateCommentCounter={updateCommentCounter}
          />
        }
      </div>
    </div>
  );
}

export default Post
