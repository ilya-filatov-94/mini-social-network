import {FC} from 'react';
import styles from './ContentPost.module.scss';
import {urlAPIimages} from '../../../env_variables'; 
import {IPostData} from '../../../types/posts';
import Likes from '../Likes/Likes';
import {users} from '../Likes/temporaryLikes';

import TextsmsOutlinedIcon from "@mui/icons-material/TextsmsOutlined";
import ShareOutlinedIcon from "@mui/icons-material/ShareOutlined";


interface IContentPostProps {
  post: IPostData;
  curTheme: string;
  isCommentOpen: boolean;
  setCommentOpen: (state: boolean) => void;
};

const ContentPost: FC<IContentPostProps> = ({
  post,
  curTheme,
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
        <Likes likes={users} curTheme={curTheme}/>
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
        <Likes likes={users} curTheme={curTheme}/>
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
