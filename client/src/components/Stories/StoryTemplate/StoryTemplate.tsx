import {FC, memo, ChangeEvent, useState} from 'react';
import styles from './StoryTemplate.module.scss';
import {TPreviewImg} from '../Stories';


interface IStoryTemplateProps {
  userId?: number;
  image: TPreviewImg;
  username: string;
  curIndex?: number;
  setIndexStory: (index: number | undefined) => void;
  setStoryCurrentUser?: (state: TPreviewImg) => void;
}

const StoryTemplate: FC<IStoryTemplateProps> = memo(({
  userId,
  image, 
  username, 
  curIndex, 
  setIndexStory,
  setStoryCurrentUser
}) => {

  const [selectedStory, selectStory] = useState<File>();

  function openStory() {
    setIndexStory(curIndex);
    console.log(curIndex);
    
  }

  function uploadStory(event: ChangeEvent<HTMLInputElement>) {
    if (event.target.files) {
      let file = event.target.files[0];
      if (!file.type.match('image')) return;
      const reader = new FileReader();      
      selectStory(file);
      if (setStoryCurrentUser) {
        reader.onloadend = () => setStoryCurrentUser(reader.result);
      }
      reader.readAsDataURL(file);
    }
  }

  return (
    <div
      onClick={openStory}
      className={image ? `${styles.story} ${styles.pointer}` : `${styles.story}`}
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
