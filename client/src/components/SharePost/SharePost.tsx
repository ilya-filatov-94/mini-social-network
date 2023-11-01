import {FC} from 'react';
import styles from './SharePost.module.scss';
import imageIcon from '../../assets/images/img.png'
import {useAppSelector} from '../../hooks/useTypedRedux';


const SharePost: FC = () => {
  const currentTheme = useAppSelector(state => state.reducerTheme.themeMode);

  return (
    <div
      className={`${styles.wrapperSharePost} ${
        currentTheme === "darkMode"
          ? styles["theme-dark"]
          : styles["theme-light"]
      }`}
    >
      <div className={styles.container}>
        <span className={styles.header}>Создать новый пост</span>
        <div className={styles.top}>
          <textarea
            rows={2}
            className={styles.input}
            placeholder={"Что у Вас нового?"}
          />
        </div>
        <div className={styles.bottom}>
          <div className={styles.left}>
            <input
              className={styles.fileInput}
              type="file"
              id="file"
              style={{ display: "none" }}
            />
            <label htmlFor="file">
              <div className={styles.item}>
                <img
                  className={styles.img}
                  src={imageIcon}
                  alt="Вложение к посту"
                />
                <span className={styles.addImageText}>Add Image</span>
              </div>
            </label>
          </div>
          <div className={styles.right}>
            <button className={styles.Btn}>Опубликовать</button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default SharePost;
