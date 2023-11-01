import {FC} from 'react';
import styles from './StoryTemplate.module.scss';
import StorySkeleton from '../StorySkeleton/StorySkeleton';

import {useInView} from 'react-intersection-observer';

interface IStoryTemplateProps {
  image: string | undefined;
  username: string;
  curIndex?: number;
  setIndexStory: (index: number | undefined) => void;
}

const StoryTemplate: FC<IStoryTemplateProps> = ({
  image, 
  username, 
  curIndex, 
  setIndexStory
}) => {

  const {ref, inView} = useInView({
    threshold: 0.2,
    triggerOnce: true,
  });

  function openStory() {
    setIndexStory(curIndex);
  }

  return (
    <div
      onClick={openStory}
      className={image ? `${styles.story} ${styles.pointer}` : `${styles.story}`}
      ref={ref}
    >
      {image && inView
      ? <img
            className={styles.imgStory}
            src={image}
            alt={`story from ${username}`}
            draggable={false}
        />
      : <StorySkeleton />}
      <span className={styles.nameUser}>{username}</span>
    </div>
  );
}

export default StoryTemplate;
