import {FC} from 'react';
import styles from './ContentPost.module.scss';
import {urlAPIimages} from '../../../env_variables'; 

import FavoriteBorderOutlinedIcon from "@mui/icons-material/FavoriteBorderOutlined";
import FavoriteOutlinedIcon from "@mui/icons-material/FavoriteOutlined";
import TextsmsOutlinedIcon from "@mui/icons-material/TextsmsOutlined";
import ShareOutlinedIcon from "@mui/icons-material/ShareOutlined";
import {IPostData} from '../../../types/posts';


interface IContentPostProps {
  post: IPostData;
  isCommentOpen: boolean;
  setCommentOpen: (state: boolean) => void;
};

const ContentPost: FC<IContentPostProps> = ({
  post,
  isCommentOpen, 
  setCommentOpen
}) => {

  const rootStyles = [styles.content];
  if (post.desc==='') {
    rootStyles.push(styles.hideTopMargin);
  }

  return (
    <>
      <div className={rootStyles.join(' ')}>
        <p className={post.desc=== '' ? styles.hideText : ''}>{post.desc}</p>
        {post.image && (
          <img
            className={styles.imgPost}
            src={urlAPIimages + post.image}
            alt={`description post ${post.id}`}
          />
        )}
      </div>
      <div className={styles.info}>
        <div className={styles.item}>
          {post.counterLikes !== 0 ? (
            <FavoriteOutlinedIcon className={styles.like} />
          ) : (
            <FavoriteBorderOutlinedIcon />
          )}
          <span>{post.counterLikes} Нравится</span>
        </div>
        <div
          className={styles.item}
          onClick={() => setCommentOpen(!isCommentOpen)}
        >
          <TextsmsOutlinedIcon />
          <span>
            {post.counterComments === 1
              ? `${post.counterComments} Комменатрий`
              : post.counterComments > 1 && post.counterComments < 5
              ? `${post.counterComments} Комментария`
              : `${post.counterComments} Комментариев`}
          </span>
        </div>
        <div className={styles.item}>
          <ShareOutlinedIcon />
          <span>Поделиться</span>
        </div>
      </div>

      <div className={styles.mobileInfo}>
        <div className={styles.item}>
          {post.counterLikes !== 0
           ? <FavoriteOutlinedIcon className={styles.like}/>
           : <FavoriteBorderOutlinedIcon />
          }
          <span>{post.counterLikes}</span>
        </div>
        <div className={styles.item} onClick={() => setCommentOpen(!isCommentOpen)}>
          <TextsmsOutlinedIcon />
          <span>{post.counterComments}</span>
        </div>
        <div className={styles.item}>
          <ShareOutlinedIcon />
        </div>
      </div>
    </>
  );
}

export default ContentPost
