import {FC} from 'react';
import styles from './ContentPost.module.scss';
import {urlAPIimages} from '../../../env_variables'; 
import {IPostData} from '../../../types/posts';
import Likes from '../Likes/Likes';
// import {users} from '../Likes/temporaryLikes';

import TextsmsOutlinedIcon from "@mui/icons-material/TextsmsOutlined";
import ShareOutlinedIcon from "@mui/icons-material/ShareOutlined";


interface IContentPostProps {
  post: IPostData;
  curTheme: string;
  numberOfComments: number;
  isCommentOpen: boolean;
  setCommentOpen: (state: boolean) => void;
};

const ContentPost: FC<IContentPostProps> = ({
  post,
  curTheme,
  numberOfComments,
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
        <Likes postId={post.id!} curTheme={curTheme}/>
        <div
          className={styles.item}
          onClick={() => setCommentOpen(!isCommentOpen)}
        >
          <TextsmsOutlinedIcon />
          <span className={styles.mobileInfo}>{numberOfComments}</span>
          <span className={styles.commInfo}>
            {numberOfComments === 1
              ? `${numberOfComments} Комменатрий`
              : numberOfComments > 1 && numberOfComments < 5
              ? `${numberOfComments} Комментария`
              : `${numberOfComments} Комментариев`}
          </span>
        </div>
        <div className={styles.item}>
          <ShareOutlinedIcon />
          <span className={styles.shareInfo}>Поделиться</span>
        </div>
      </div>
    </>
  );
}

export default ContentPost
