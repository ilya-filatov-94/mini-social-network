import {FC, useState} from 'react';
import styles from './Post.module.scss';

import {useAppSelector} from '../../hooks/useTypedRedux';
import InfoAuthorOfPost from './InfoAuthorOfPost/InfoAuthorOfPost';
import ContentPost from './ContentPost/ContentPost';
import Comments from './Comments/Comments';
import {IPostData} from '../../types/posts';

interface IPostsProps {
  currentUser: boolean;
  userId: number;
  post: IPostData;
};

const Post: FC<IPostsProps> = ({post, currentUser, userId}) => {

  const currentTheme = useAppSelector(state => state.reducerTheme.themeMode);
  const [commentOpen, setCommentOpen] = useState<boolean>(false);

  return (
    <div className={currentTheme ==='darkMode'
      ? `${styles.post} ${styles['theme-dark']}`
      : `${styles.post} ${styles['theme-light']}`
    }>
      <div className={styles.container}>
        <InfoAuthorOfPost post={post} currentUser={currentUser} curTheme={currentTheme}/>

        <ContentPost 
          post={post}
          commentOpen={commentOpen}
          setCommentOpen={setCommentOpen}
        />

        {commentOpen && <Comments userId={userId} currentUser={currentUser} curTheme={currentTheme}/>}
      </div>
    </div>
  );
}

export default Post
