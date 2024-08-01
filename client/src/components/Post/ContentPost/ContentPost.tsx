import {FC, useState, useCallback} from 'react';
import styles from './ContentPost.module.scss';
import {urlAPIimages, urlClient} from '../../../env_variables'; 
import { shallowEqual } from 'react-redux';
import {useAppSelector, useAppDispatch} from '../../../hooks/useTypedRedux';
import {emitNotification} from '../../../store/notificationSlice';
import axios from 'axios';
import {IPostData} from '../../../types/posts';
import Likes from '../Likes/Likes';
import {
  TextsmsOutlined as TextsmsOutlinedIcon,
  ShareOutlined as ShareOutlinedIcon
} from "@mui/icons-material";
import ErrorOutlinedIcon from '@mui/icons-material/ErrorOutlined';
import TemplatePopup from '../../TemplatePopup/TemplatePopup';
import {useAddPostMutation} from '../../../services/PostService';

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

  const currUser = useAppSelector(state => state.reducerAuth.currentUser, shallowEqual);
  const dispatch = useAppDispatch();
  const [isErrorShared, setErrorShared] = useState<boolean>(false);
  const [isVisiblePopupShared, setVisiblePopupShared] = useState<boolean>(false);
  const [addPost, {error: isErrorSharedPost}] = useAddPostMutation();
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

  const renderPopupShared = useCallback(() => {
    return (
        <div className={`${styles.wrapperPopup} ${curTheme ==='darkMode' ? styles['theme-dark'] : ''}}`}>
          <p onClick={sharedPostOnPage}>
            Поделиться на своей странице
          </p>
          <p onClick={getSharedRefOnPost}>
            Отправить ссылку
          </p>
        </div>
      )
  }, []);

  async function sharedPostOnPage() {
    const formData = new FormData();
    formData.append('id', `${currUser.id}`);
    if (post.desc) {
      formData.append('desc', `Пост со страницы пользователя ${post.user.username}: ` + post.desc);
    }
    if (post.image) {
      const response = await axios({
        method: 'get',
        url: urlAPIimages + post.image,
        responseType: 'blob'
      });
      formData.append('image', response.data);
    }
    if (!post.desc && !post.image) return;
    await addPost(formData).unwrap().then(() => {
      const dataNotification = {
        userId: post.user.id!,
        ref: '/post/' + post.id,
        type: 'sharedPost'
      };
      dispatch(emitNotification(dataNotification));
      setVisiblePopupShared(false);
    }).catch((error: unknown) => {
      console.error(error);
    });
  }

  async function getSharedRefOnPost() {
    const shareObj = {
      title: document.title,
      url: urlClient + '/post/' + post.id,
    }
    try {
      await navigator.share(shareObj);
      const dataNotification = {
        userId: post.user.id!,
        ref: '/post/' + post.id,
        type: 'sharedPost'
      };
      dispatch(emitNotification(dataNotification));
      setVisiblePopupShared(false);
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
        <Likes postId={post.id!} userId={post.user.id!} curTheme={curTheme}/>
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
        <div className={styles.item} onClick={() => setVisiblePopupShared(true)}>
          <ShareOutlinedIcon />
          <span className={styles.shareInfo}>Поделиться</span>
        </div>
      </div>
      <TemplatePopup 
        isVisible={isErrorShared} 
        setVisible={() => setErrorShared(false)}
        headerPopup={<p>Ошибка!</p>}
        contentPopup={
          <div className={styles.errorShared}>
            <ErrorOutlinedIcon style={{color: 'red'}}/><p>Не удалось поделиться</p>
          </div>
        }
      />
      <TemplatePopup 
        isVisible={isVisiblePopupShared} 
        setVisible={() => setVisiblePopupShared(false)}
        headerPopup='Поделиться постом'
        contentPopup={renderPopupShared()}
      />
    </>
  );
}

export default ContentPost
