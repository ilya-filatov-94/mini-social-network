import {FC} from 'react';
import styles from './Stories.module.scss';
import {stories} from './temporaryData';

import {useAppSelector} from '../../hooks/useTypedRedux';
import StoryTemplate from './StoryTemplate/StoryTemplate';


const Stories: FC = () => {
  const currentUser = useAppSelector(state => state.reducerAuth.currentUser);

  return (
    <div className={styles.stories}>
      <StoryTemplate 
        image={undefined} 
        username={currentUser.username}
      />
      {stories.map(story => 
        <StoryTemplate 
          key={story.id}
          image={story.image} 
          username={story.username}
        />
      )}
    </div>
  )
}

export default Stories;
