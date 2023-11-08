import {FC, useState} from 'react';
import styles from './Post.module.scss';

import {useAppSelector} from '../../hooks/useTypedRedux';
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
  post: IPostData;
};

const Post: FC<IPostsProps> = ({post, currentUser, userId}) => {

  const currentTheme = useAppSelector(state => state.reducerTheme.themeMode);
  const [postIsEdited, editPost] = useState<boolean>(false);
  const [deletePost, {error}] = useDeletePostMutation();
  const isFetchBaseQueryErrorType = (error: any): error is FetchBaseQueryError => 'status' in error;
  const [commentOpen, setCommentOpen] = useState<boolean>(false);

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
          curTheme={currentTheme}
          editPost={editPost}
          deletePost={deletePostFn}
        />

        {!postIsEdited &&
          <ContentPost 
            post={post}
            commentOpen={commentOpen}
            setCommentOpen={setCommentOpen}
          />
        }

        {postIsEdited &&
          <EditPost 
            post={post}
            postIsEdited={postIsEdited}
            editPost={editPost}
            curTheme={currentTheme}
          />
        }

        {commentOpen && <Comments userId={userId} currentUser={currentUser} curTheme={currentTheme}/>}
      </div>
    </div>
  );
}

export default Post
