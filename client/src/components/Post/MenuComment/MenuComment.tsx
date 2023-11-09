import {FC, useState} from 'react';
import styles from './MenuComment.module.scss';
import MoreHorizIcon from "@mui/icons-material/MoreHoriz";

interface IMenuCommentProps {
    idComment: number;
    deleteComment: (id: number) => void;
    curTheme: string;
}

const MenuComment: FC<IMenuCommentProps> = ({
    idComment,
    deleteComment,
    curTheme
}) => {

    const [menuIsOpen, openMenu] = useState<boolean>(false);

    function toggleMenu() {
      openMenu(!menuIsOpen);
    }

    if (!menuIsOpen) {
      return <MoreHorizIcon className={styles.moreIcon} onClick={toggleMenu}/>
    }

    return (
        <div className={styles.menu}>
          <div className={`${styles.background} ${menuIsOpen ? styles.active : ''}`} 
            onClick={toggleMenu}
          />
          <div className={`${styles.contentWindow} ${curTheme ==='darkMode' 
          ? styles['theme-dark'] 
          : styles['theme-light']}`}>
            <div className={styles.button} onClick={() => deleteComment(idComment)}>
              Удалить
            </div>
            <div className={styles.button} onClick={toggleMenu}>
              Отменить
            </div>
          </div>
        </div>
    );
};

export default MenuComment;
