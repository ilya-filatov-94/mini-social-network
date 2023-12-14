import {FC} from 'react';
import styles from './ContentPost.module.scss';
import {urlAPIimages} from '../../../env_variables'; 
import {IPostData} from '../../../types/posts';
import Likes from '../Likes/Likes';
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

  function declensionOfComment(number: number) {
    let word = 'Комментари';
    const remainderOfdivision = number % 10;
    if (number === 0 || number === 11) {
      return number + ' ' + word + 'ев'
    }
    if (remainderOfdivision === 1 || number === 1) {
      return number + ' ' + word + 'й'
    }
    if (number !== 12 && number !== 13 && number !== 14 &&
        (remainderOfdivision === 2 ||
        remainderOfdivision === 3 ||
        remainderOfdivision === 4)) {
          return number + ' ' + word + 'я'
    } else {
      return number + ' ' + word + 'ев'
    }
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
            {declensionOfComment(numberOfComments)}
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
