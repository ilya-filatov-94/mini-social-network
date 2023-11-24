import {FC} from 'react';
import styles from './Home.module.scss';

import Stories from '../../components/Stories/Stories';
import UserActivity from '../../components/UserActivity/UserActivity';


const Home: FC = () => {

  return (
    <div className={styles.home}>
      <Stories />
      <UserActivity />
    </div>
  )
}

export default Home
