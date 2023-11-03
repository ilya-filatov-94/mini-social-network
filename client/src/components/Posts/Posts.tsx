import {FC} from 'react';
import styles from './Posts.module.scss';
import Post from '../Post/Post';
import {IPost} from '../../types/posts';

interface IPostsProps {
  posts: IPost[]
};

const Posts: FC<IPostsProps> = ({posts}) => {
  return (
    <div className={styles.posts}>
      {posts?.length !== 0 &&
        posts.map(post => 
        <Post key={post.id} post={post} />
      )}
    </div>
  )
}

export default Posts;
