import {FC} from 'react';
import styles from './Home.module.scss';

import Stories from '../../components/Stories/Stories';
import Posts from '../../components/Posts/Posts';
import {posts} from '../../components/Posts/temporaryDataPosts';

const Home: FC = () => {

  return (
    <div className={styles.home}>
      <Stories />
      <Posts posts={posts}/>
    </div>
  )
}

export default Home
