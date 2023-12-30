import {FC, Suspense} from 'react';
import styles from './Layout.module.scss';

import Navbar from '../Navbar/Navbar';
import LeftBar from '../LeftBar/LeftBar';
import { Outlet } from 'react-router-dom';
import RightBar from '../RightBar/RightBar';
import {useAppSelector} from '../../hooks/useTypedRedux';
import { shallowEqual } from 'react-redux';
import Loader from '../Loader/Loader';

const Layout: FC = () => {

  const currentTheme = useAppSelector(state => state.reducerTheme.themeMode, shallowEqual);

  return (
    <div>
      <Navbar />
      <div className={currentTheme ==='darkMode'
        ? `${styles.main} ${styles['theme-dark']}`
        : `${styles.main} ${styles['theme-light']}`
      }>
        <LeftBar />
        <div className={styles.wrpapperOutlet}>
          <Suspense fallback={<Loader />}>
            <Outlet />
          </Suspense>
        </div>
        <RightBar />
      </div>
    </div>
  )
}

export default Layout
