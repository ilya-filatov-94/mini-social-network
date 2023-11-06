import {FC, ChangeEvent, useState} from 'react';
import styles from './SharePost.module.scss';
import imageIcon from '../../assets/images/img.png'
import {useAppSelector} from '../../hooks/useTypedRedux';
import {useAddPostMutation} from '../../services/PostService';
import Alert from '@mui/material/Alert';
import { 
  FetchBaseQueryError,
} from "@reduxjs/toolkit/query/react";

interface ISharePostProps {
  userId: number;
}

const SharePost: FC<ISharePostProps> = ({userId}) => {
  const currentTheme = useAppSelector(state => state.reducerTheme.themeMode);
  const isFetchBaseQueryErrorType = (error: any): error is FetchBaseQueryError => 'status' in error;
  const [addPost, {error}] = useAddPostMutation();
  const [selectedFile, setSelectedFile] = useState<File>();
  const [desc, setDesc] = useState("");

  function handleImagePost(event: ChangeEvent<HTMLInputElement>) {
    if (event.target.files) {
      setSelectedFile(event.target.files[0]);
    }    
  }

  async function handleUpload() {
    const formData = new FormData();
    formData.append('id', `${userId}`);
    formData.append('desc', desc);
    if (selectedFile) {
      console.log('Отправить пост с изображением');
      formData.append('image', selectedFile);
    }
    await addPost(formData).unwrap();
  }

  if (error) {
    if (isFetchBaseQueryErrorType(error)) {
      return <Alert severity="error" sx={{m: 20}}>Произошла ошибка при загрузке данных! {error.status}</Alert>
    }
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
            onBlur={(event) => setDesc(event.target.value)}
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
