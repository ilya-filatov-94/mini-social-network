import {FC, useState} from 'react';
import styles from './ContentPost.module.scss';
import {urlAPIimages, urlClient} from '../../../env_variables'; 
import {IPostData} from '../../../types/posts';
import Likes from '../Likes/Likes';
import { useLocation } from "react-router-dom";
import {
  TextsmsOutlined as TextsmsOutlinedIcon,
  ShareOutlined as ShareOutlinedIcon
} from "@mui/icons-material";
import ErrorOutlinedIcon from '@mui/icons-material/ErrorOutlined';
import TemplatePopup from '../../TemplatePopup/TemplatePopup';

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

  const location = useLocation();
  const [isErrorShared, setErrorShared] = useState<boolean>(false);
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

  async function getShared() {
    const shareObj = {
      title: document.title,
      url: urlClient + location.pathname,
    }
    try {
      await navigator.share(shareObj);
    } catch(err) {
      setErrorShared(true);
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
        <div className={styles.item} onClick={getShared}>
          <ShareOutlinedIcon />
          <span className={styles.shareInfo}>Поделиться</span>
        </div>
      </div>
      <TemplatePopup 
        isVisible={isErrorShared} 
        setVisible={setErrorShared}
        headerPopup={<p>Ошибка!</p>}
        contentPopup={
          <div className={styles.errorShared}>
            <ErrorOutlinedIcon style={{color: 'red'}}/><p>Не удалось поделиться</p>
          </div>
        }
      />
    </>
  );
}

export default ContentPost
