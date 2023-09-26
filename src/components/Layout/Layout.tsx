import {ReactElement} from 'react';
import styles from './Layout.module.scss';

import Navbar from '../Navbar/Navbar';
import LeftBar from '../LeftBar/LeftBar';
import { Outlet } from 'react-router-dom';
import RightBar from '../RightBar/RightBar';


const Layout = (): ReactElement => {
  return (
    <div>
      <Navbar />
      <div className={styles.main}>
        <LeftBar />
        <Outlet />
        <RightBar />
      </div>
    </div>
  )
}

export default Layout
