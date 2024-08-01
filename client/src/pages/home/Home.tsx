import {FC} from 'react';
import styles from './Home.module.scss';

import Stories from '../../components/Stories/Stories';
import UserActivity from '../../components/UserActivity/UserActivity';


const Home: FC = () => {

  return (
    <div className={styles.home}>
      <div className={styles.wrapper}>
        <Stories />
        <UserActivity />
      </div>
    </div>
  )
}

export default Home
