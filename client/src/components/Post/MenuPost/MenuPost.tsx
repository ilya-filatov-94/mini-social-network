import {FC} from 'react';
import styles from './MenuPost.module.scss';

interface IMenuPostProps {
  isVisible: boolean;
  setVisible: (state: boolean) => void;
  idPost: number | undefined;
  curTheme: string;
  position: string;
}

const MenuPost: FC<IMenuPostProps> = ({
  isVisible, 
  setVisible, 
  idPost, 
  curTheme,
  position,
}) => {

  if (!isVisible) return null;

  function getIdPost() {
    console.log(idPost);
  }

  return (
      <div className={styles.menu} onClick={() => setVisible(!isVisible)}>
        <div className={curTheme ==='darkMode'
            ? `${styles.contentWindow} ${position} ${styles['theme-dark']}`
            : `${styles.contentWindow} ${position} ${styles['theme-light']}`
        }>
          <div className={styles.button} onClick={getIdPost}>
            Редактировать
          </div>
          <div className={styles.button}>
            Удалить
          </div>
        </div>
      </div>
  );
}

export default MenuPost;
