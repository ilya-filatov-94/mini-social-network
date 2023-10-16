import {FC} from 'react';
import styles from './StorySkeleton.module.scss';

const StorySkeleton: FC = () => {
  return (
    <div className={styles.inox_gloss_blue}>
        <button className={styles.addStory}>+</button>
    </div>
  )
}

export default StorySkeleton;
