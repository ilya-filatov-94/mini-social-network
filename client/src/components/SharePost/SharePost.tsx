import {FC, ChangeEvent, useState, useRef, memo} from 'react';
import styles from './SharePost.module.scss';
import {useAppSelector} from '../../hooks/useTypedRedux';
import {useAddPostMutation} from '../../services/PostService';
import Alert from '@mui/material/Alert';
import { 
  FetchBaseQueryError,
} from "@reduxjs/toolkit/query/react";
import PreviewComponent from './PreviewComponent/PreviewComponent';

export type TPreviewImg = string | ArrayBuffer | null;

interface ISharePostProps {
  userId: number;
}

const SharePost: FC<ISharePostProps> = memo(({userId}) => {
  const currentTheme = useAppSelector(state => state.reducerTheme.themeMode);
  const [addPost, {error}] = useAddPostMutation();
  const isFetchBaseQueryErrorType = (error: any): error is FetchBaseQueryError => 'status' in error;
  const [selectedFile, setSelectedFile] = useState<File>();
  const [previewImg, setPreviewImg] = useState<TPreviewImg>();
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  function handleImagePost(event: ChangeEvent<HTMLInputElement>) {
    if (event.target.files) {
      let file = event.target.files[0];
      if (!file.type.match('image')) return;
      setSelectedFile(file);

      const reader = new FileReader();
      reader.onloadend = () => setPreviewImg(reader.result)
      reader.readAsDataURL(file);
    }
  }

  function removeImagePost(event: MouseEvent | PointerEvent) {
    event.stopPropagation();
    event.preventDefault();
    setSelectedFile(undefined);
    setPreviewImg(null);
  }

  async function handleUpload() {
    let textPost;
    const formData = new FormData();
    formData.append('id', `${userId}`);
    if (textareaRef.current) {
      textPost = textareaRef.current.value;
      formData.append('desc', textPost);
    }
    if (selectedFile) {
      formData.append('image', selectedFile);
    }
    if (!textPost && !selectedFile) return;
    await addPost(formData).unwrap();
    if (textareaRef.current) textareaRef.current.value = '';
    setSelectedFile(undefined);
    setPreviewImg(null);
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
            ref={textareaRef}
            rows={2}
            maxLength={255}
            className={styles.input}
            placeholder={"Что у Вас нового?"}
          />
        </div>
        <div className={styles.bottom}>
          <div className={styles.left}>
            {!previewImg &&
            <input
              onChange={handleImagePost}
              className={styles.fileInput}
              type="file"
              accept=".jpeg, .jpg, .png"
              id="file"
            />}
            <label htmlFor="file">
              <PreviewComponent 
                dataImg={previewImg}
                fileMetaData={selectedFile?.name}
                curTheme={currentTheme}
                remove={removeImagePost}
              />
            </label>
          </div>
          <div className={styles.right}>
            <button onClick={handleUpload} className={styles.Btn}>Опубликовать</button>
          </div>
        </div>
      </div>
    </div>
  );
});


export default SharePost;
