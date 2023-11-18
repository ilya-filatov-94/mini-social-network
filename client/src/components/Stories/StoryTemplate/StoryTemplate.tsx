import {FC, memo, ChangeEvent, RefObject} from 'react';
import styles from './StoryTemplate.module.scss';
import {TPreviewImg} from '../Stories';
import {useAddStoryMutation} from '../../../services/StoryService';
import {FetchBaseQueryError} from "@reduxjs/toolkit/query/react";
import Loader from '../../Loader/Loader';
import Alert from '@mui/material/Alert';

import {TEventTouch} from '../Stories';

interface IStoryTemplateProps {
  userId?: number;
  image: TPreviewImg;
  username: string;
  curIndex?: number;
  refElem?: RefObject<HTMLDivElement>
  setIndexStory: (index: number | undefined) => void;
  setStoryCurrentUser?: (state: TPreviewImg) => void;
  openStory: (event: TEventTouch) => void;
}

const StoryTemplate: FC<IStoryTemplateProps> = memo(({
  userId,
  image, 
  username, 
  curIndex, 
  setIndexStory,
  setStoryCurrentUser,
  openStory,
  refElem
}) => {

  const [addStory, {isLoading, error}] = useAddStoryMutation();
  const isFetchBaseQueryErrorType = (error: any): error is FetchBaseQueryError => 'status' in error;

  function openCurStory(event: TEventTouch) {
    setIndexStory(curIndex);
    openStory(event);
  }

  async function uploadStory(event: ChangeEvent<HTMLInputElement>) {
    if (event.target.files) {
      let file = event.target.files[0];
      if (!file.type.match('image')) return;
      const reader = new FileReader();      
      if (setStoryCurrentUser) {
        reader.onloadend = () => setStoryCurrentUser(reader.result);
      }
      reader.readAsDataURL(file);
      const formData = new FormData();
      formData.append('userId', `${userId}`);
      formData.append('image', file);
      await addStory(formData).unwrap();
    }
  }
  
  return (
    <div
      onClick={openCurStory}
      className={image ? `${styles.story} ${styles.pointer}` : `${styles.story}`}
      ref={refElem}
    >
      {image
      ? <img
            className={styles.imgStory}
            src={image as string}
            alt={`story from ${username}`}
            draggable={false}
        />
      : <div className={styles.inox_gloss_blue}>
          <label htmlFor="btnAddStory" className={styles.addStory}>+</label>
          <input
            onChange={uploadStory}
            className={styles.fileInput}
            type="file"
            accept=".jpeg, .jpg, .png"
            id="btnAddStory"
            name="storyUser"
          />
        </div>
      }
      <span className={styles.nameUser}>{username}</span>
    </div>
  );
});



export default StoryTemplate;
