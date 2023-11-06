import {FC} from 'react';
import styles from './Home.module.scss';

import Stories from '../../components/Stories/Stories';
// import Posts from '../../components/Posts/Posts';


const Home: FC = () => {

  return (
    <div className={styles.home}>
      <Stories />
      {/* <Posts /> */}
    </div>
  )
}

export default Home
