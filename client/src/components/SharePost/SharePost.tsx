import {FC, ChangeEvent, useState} from 'react';
import styles from './SharePost.module.scss';
import imageIcon from '../../assets/images/img.png'
import {useAppSelector} from '../../hooks/useTypedRedux';

import {useGetAllPostsQuery} from '../../services/PostService';

interface ISharePostProps {
  userId: number;
}

const SharePost: FC<ISharePostProps> = ({userId}) => {
  const postService = useGetAllPostsQuery();
  const currentTheme = useAppSelector(state => state.reducerTheme.themeMode);
  const [selectedFile, setSelectedFile] = useState<File>();

  function handleImagePost(event: ChangeEvent<HTMLInputElement>) {
    if (event.target.files) {
      console.log(event.target.files);
      setSelectedFile(event.target.files[0]);
    }
  }

  function handleUpload() {


    console.log(postService.data);
    
    // const formData = new FormData();
    // formData.append('userId', `${userId}`);
    // formData.append('desc', 'Содержание поста');
    // if (selectedFile) {
    //   console.log('Отправить пост с изображением');
    //   formData.append('image', selectedFile);
    // }
    // createPost(formData).then(data);
  }

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
              onChange={handleImagePost}
              className={styles.fileInput}
              type="file"
              accept=".jpeg, .jpg, .png"
              id="file"
            />
            <label htmlFor="file">
              <div className={styles.item}>
                <img
                  className={styles.img}
                  src={imageIcon}
                  alt="Вложение к посту"
                />
                <span className={styles.addImageText}>Прикрепить фото</span>
              </div>
            </label>
          </div>
          <div className={styles.right}>
            <button onClick={handleUpload} className={styles.Btn}>Опубликовать</button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default SharePost;
