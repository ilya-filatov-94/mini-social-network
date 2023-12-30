import {
    FC,
    useState,
    useEffect, 
    useRef,
    ChangeEvent
} from 'react';
import axios from 'axios';
import styles from './EditPost.module.scss';
import {IPostData} from '../../../types/posts';
import {urlAPIimages} from '../../../env_variables'; 
import PreviewComponent from '../../SharePost/PreviewComponent/PreviewComponent';
import {useUpdatePostMutation} from '../../../services/PostService';
import Loader from '../../Loader/Loader';
import AlertWidget from '../../AlertWidget/AlertWidget';
import {FetchBaseQueryError} from "@reduxjs/toolkit/query/react";

export type TPreviewImg = string | ArrayBuffer | null;

interface IEditPostProps {
  post: IPostData;
  editPost: (state: boolean) => void;
  curTheme: string;
};

const EditPost: FC<IEditPostProps> = ({
    post,
    editPost,
    curTheme
}) => {

  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const [selectedFile, setSelectedFile] = useState<File>();
  const [previewImg, setPreviewImg] = useState<TPreviewImg>();
  const [updatePost, {isLoading, error}] = useUpdatePostMutation();
  const isFetchBaseQueryErrorType = (error: any): error is FetchBaseQueryError => 'status' in error;

  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.value = post.desc;
    }
    if (post.image) {
      loadPreviewImg(urlAPIimages + post.image);
    }
  // eslint-disable-next-line
  }, []);

  async function loadPreviewImg(urlFile: string) {
    if (urlFile) {
      const response = await axios({
        method: 'get',
        url: urlFile,
        responseType: 'blob'
      });
      const reader = new FileReader();
      reader.onloadend = () => setPreviewImg(reader.result)
      reader.readAsDataURL(response.data);
      setSelectedFile(response.data);
    }
  }

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

  async function handleUpdate() {
    let textPost;
    const formData = new FormData();
    formData.append('id', `${post.id}`);
    if (textareaRef.current) {
      textPost = textareaRef.current.value;
      formData.append('desc', textPost);
    }
    if (selectedFile) {
      formData.append('image', selectedFile);
    }
    if (!textPost && !selectedFile) return;
    await updatePost(formData).unwrap();
    editPost(false);
  }

  if (isLoading) {
    return <Loader />
  }

  if (error) {
    if (isFetchBaseQueryErrorType(error)) {
      return (
      <AlertWidget
        addClass={styles.alertStyle}
        error={error} 
        errorMessage='Ошибка редактирования поста!'
      />)
    }
  }

  return (
    <div className={`${styles.container} ${
        curTheme === "darkMode"
          ? styles["theme-dark"]
          : styles["theme-light"]
      }`}>
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
              id="updateFile"
            />}
            <label htmlFor="updateFile">
              <PreviewComponent 
                dataImg={previewImg}
                fileMetaData={selectedFile?.name}
                curTheme={curTheme}
                remove={removeImagePost}
              />
            </label>
          </div>
          <div className={styles.right}>
            <button onClick={handleUpdate} className={styles.Btn}>Сохранить</button>
          </div>
        </div>
      </div>
  )
}

export default EditPost;
