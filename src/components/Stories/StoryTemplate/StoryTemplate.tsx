import {FC} from 'react';
import styles from './StoryTemplate.module.scss';
import {IStory} from '../../../types/story';


const StoryTemplate: FC<IStory> = ({image, username}) => {
  return (
    <div className={styles.story}>
      {image
      ? <img
            className={styles.imgStory}
            src={image}
            alt={`story from ${username}`}
        />
      : <div className={styles.inox_gloss_blue}>
          <button className={styles.addStory}>+</button>
        </div>}
      <span className={styles.nameUser}>{username}</span>
    </div>
  );
}

export default StoryTemplate;
