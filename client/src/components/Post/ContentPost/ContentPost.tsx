import {FC} from 'react';
import styles from './ContentPost.module.scss';

import FavoriteBorderOutlinedIcon from "@mui/icons-material/FavoriteBorderOutlined";
import FavoriteOutlinedIcon from "@mui/icons-material/FavoriteOutlined";
import TextsmsOutlinedIcon from "@mui/icons-material/TextsmsOutlined";
import ShareOutlinedIcon from "@mui/icons-material/ShareOutlined";
import {IPost} from '../../../types/posts';


interface IContentPostProps {
  post: IPost;
  commentOpen: boolean;
  setCommentOpen: (state: boolean) => void;
};


const ContentPost: FC<IContentPostProps> = ({
  post, 
  commentOpen, 
  setCommentOpen
}) => {
  
  return (
    <>
      <div className={styles.content}>
        <p>{post.desc}</p>
        {post.img && (
          <img
            className={styles.imgPost}
            src={post.img}
            alt={`description post ${post.id}`}
          />
        )}
      </div>
      <div className={styles.info}>
        <div className={styles.item}>
          {post.likes ? (
            <FavoriteOutlinedIcon />
          ) : (
            <FavoriteBorderOutlinedIcon />
          )}
          <span>{post.likes} Нравится</span>
        </div>
        <div
          className={styles.item}
          onClick={() => setCommentOpen(!commentOpen)}
        >
          <TextsmsOutlinedIcon />
          <span>
            {post.comments?.length === 1
              ? `${post.comments.length} Комменатрий`
              : post.comments?.length! > 1 && post.comments?.length! < 5
              ? `${post.comments?.length} Комментария`
              : `${post.comments?.length} Комментариев`}
          </span>
        </div>
        <div className={styles.item}>
          <ShareOutlinedIcon />
          <span>Поделиться</span>
        </div>
      </div>

      <div className={styles.mobileInfo}>
        <div className={styles.item}>
          {post.likes
           ? <FavoriteOutlinedIcon />
           : <FavoriteBorderOutlinedIcon />
          }
          <span>{post.likes}</span>
        </div>
        <div className={styles.item} onClick={() => setCommentOpen(!commentOpen)}>
          <TextsmsOutlinedIcon />
          <span>{post.comments?.length}</span>
        </div>
        <div className={styles.item}>
          <ShareOutlinedIcon />
        </div>
      </div>
    </>
  );
}

export default ContentPost
