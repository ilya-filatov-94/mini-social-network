import {FC, useState} from 'react';
import styles from './Post.module.scss';

import {useAppSelector} from '../../hooks/useTypedRedux';
import InfoAuthorOfPost from './InfoAuthorOfPost/InfoAuthorOfPost';
import ContentPost from './ContentPost/ContentPost';
import Comments from './Comments/Comments';
import {IPost} from '../../types/posts';




interface IPostsProps {
  post: IPost;
};

const Post: FC<IPostsProps> = ({post}) => {

  const currentTheme = useAppSelector(state => state.reducerTheme.themeMode);
  const [commentOpen, setCommentOpen] = useState<boolean>(false);

  return (
    <div className={currentTheme ==='darkMode'
      ? `${styles.post} ${styles['theme-dark']}`
      : `${styles.post} ${styles['theme-light']}`
    }>
      <div className={styles.container}>
        <InfoAuthorOfPost post={post}/>

        <ContentPost 
          post={post}
          commentOpen={commentOpen}
          setCommentOpen={setCommentOpen}
        />

        {commentOpen && <Comments comments={post.comments} curTheme={currentTheme}/>}
      </div>
    </div>
  );
}

export default Post
