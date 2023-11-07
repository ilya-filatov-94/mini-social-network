import {FC, useState} from 'react';
import styles from './InfoAuthorOfPost.module.scss';
import {IPostData} from '../../../types/posts';
import MoreHorizIcon from "@mui/icons-material/MoreHoriz";
import { Link } from 'react-router-dom';
import noAvatar from '../../../assets/images/no-avatar.jpg';
import {urlAPIimages} from '../../../env_variables';
import MenuPost from '../MenuPost/MenuPost';

interface IPostsProps {
  post: IPostData;
  currentUser: boolean;
  curTheme: string;
};

const InfoAuthorOfPost: FC<IPostsProps> = ({post, currentUser, curTheme}) => {

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
            to={`/profile/${post.refUser}`}
            replace={true}>
            <span className={styles.username}>{post.username}</span>
          </Link>
          <span className={styles.date}>{post.date}</span>
        </div>
      </div>
      {currentUser && 
      <MenuPost
        isVisible={menuIsOpen} 
        setVisible={openMenu}
        idPost={post.id}
        curTheme={curTheme}
        position={''}
      />}
      {currentUser && <MoreHorizIcon onClick={() => openMenu(!menuIsOpen)}/>}
    </div>
  );
}

export default InfoAuthorOfPost;
