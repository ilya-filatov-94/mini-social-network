import {FC, useState} from 'react';
import styles from './InfoAuthorOfPost.module.scss';
import {IPostData} from '../../../types/posts';
import MoreHorizIcon from "@mui/icons-material/MoreHoriz";
import { Link } from 'react-router-dom';
import noAvatar from '../../../assets/images/no-avatar.jpg';
import {urlAPIimages} from '../../../env_variables';
import MenuPost from '../MenuPost/MenuPost';
import {getRelativeTimeString} from '../../../helpers/dateTimeFormatting';

interface IPostsProps {
  post: IPostData;
  currentUser: boolean;
  curUserId: number;
  curTheme: string;
  editPost: (state: boolean) => void;
  deletePost: () => void;
};

const InfoAuthorOfPost: FC<IPostsProps> = ({
  post, 
  currentUser, 
  curUserId,
  curTheme,
  editPost,
  deletePost
}) => {

  const [menuIsOpen, openMenu] = useState<boolean>(false);

  return (
    <div className={styles.user}>
      <div className={`${styles.background} ${menuIsOpen ? styles.active : ''}`} 
        onClick={() => openMenu(false)}
      />
      <div className={styles.userInfo}>
        <img
          className={styles.avatar}
          src={post.profilePic ? urlAPIimages + post.profilePic : noAvatar}
          alt={`post ${post.id} photо`}
        />
        <div className={styles.details}>
          <Link
            className={styles.link}
            to={currentUser ? `/profile/${post.refUser}` : `/profile/${post.refUser}?id=${curUserId}`}
            replace={true}>
            <span className={styles.username}>{post.username}</span>
          </Link>
          <span className={styles.date}>{getRelativeTimeString(new Date(post.date!), 'ru')}</span>
        </div>
      </div>
      {currentUser && 
      <MenuPost
        isVisible={menuIsOpen} 
        setVisible={openMenu}
        editPost={editPost}
        deletePost={deletePost}
        curTheme={curTheme}
      />}
      {currentUser && 
        <MoreHorizIcon 
          onClick={() => openMenu(!menuIsOpen)}
          className={styles.moreIcon}
        />
      }
    </div>
  );
}

export default InfoAuthorOfPost;
