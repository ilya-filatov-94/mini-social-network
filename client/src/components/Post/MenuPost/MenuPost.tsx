import {FC} from 'react';
import styles from './MenuPost.module.scss';

interface IMenuPostProps {
  isVisible: boolean;
  setVisible: (state: boolean) => void;
  editPost: (state: boolean) => void;
  deletePost: () => void;
  curTheme: string;
}

const MenuPost: FC<IMenuPostProps> = ({
  isVisible, 
  setVisible, 
  editPost,
  deletePost,
  curTheme,
}) => {

  if (!isVisible) return null;

  return (
      <div className={styles.menu} onClick={() => setVisible(!isVisible)}>
        <div className={`${styles.contentWindow} ${curTheme ==='darkMode' 
        ? styles['theme-dark'] 
        : styles['theme-light']}`}>
          <div className={styles.button} onClick={() => editPost(true)}>
            Редактировать
          </div>
          <div className={styles.button} onClick={deletePost}>
            Удалить
          </div>
          <div className={styles.button} onClick={() => editPost(false)}>
            Отменить редактирование
          </div>
        </div>
      </div>
  );
}

export default MenuPost;
