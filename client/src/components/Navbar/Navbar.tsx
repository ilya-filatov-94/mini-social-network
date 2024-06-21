import {FC, useState, memo } from 'react';
import styles from './Navbar.module.scss';

import {useAppDispatch, useAppSelector} from '../../hooks/useTypedRedux';
import { shallowEqual } from 'react-redux';
import {switchTheme} from '../../store/themeSlice';
import Logo from '../Logo/Logo';
import { useNavigate} from "react-router-dom";
import UserAvatar from '../UserAvatar/UserAvatar';
import MenuUser from './MenuUser/MenuUser';
import BurgerElement from './BurgerElement/BurgerElement';
import MobileMenu from './MobileMenu/MobileMenu';
import {useMatchMedia} from '../../hooks/useMatchMedia';
import {
  HomeOutlined as HomeOutlinedIcon,
  DarkModeOutlined as DarkModeOutlinedIcon,
  WbSunnyOutlined as WbSunnyOutlinedIcon,
  NotificationsOutlined as NotificationsOutlinedIcon,
  Diversity3Outlined as Diversity3OutlinedIcon
} from '@mui/icons-material';



const Navbar: FC = memo(() => {

  const {isMobile} = useMatchMedia();
  const navigate = useNavigate();
  const currentTheme = useAppSelector(state => state.reducerTheme.themeMode, shallowEqual);
  const currentUser = useAppSelector(state => state.reducerAuth.currentUser, shallowEqual);
  const dispatch = useAppDispatch();
  const [menuIsOpen, openMenu] = useState<boolean>(false);

  function handlerSwitchTheme() {
    dispatch(switchTheme());
  }

  function navigateTo(path: string) {
    navigate(path);
  }

  return (
    <div className={currentTheme ==='darkMode'
    ? `${styles.navbar} ${styles['theme-dark']}`
    : `${styles.navbar} ${styles['theme-light']}`
    }>
      <div className={styles.leftSection}>
        <Logo themeMode={currentTheme}/>
        <HomeOutlinedIcon onClick={()=> navigateTo('/')} sx={{cursor: 'pointer'}}/>
        <div
          className={styles.themeSwitch}
          onClick={handlerSwitchTheme}>
          {currentTheme === 'darkMode'
            ? <WbSunnyOutlinedIcon />
            : <DarkModeOutlinedIcon />
          }
        </div>
        < Diversity3OutlinedIcon onClick={()=> navigateTo('/users')} sx={{cursor: 'pointer'}} />
      </div>

      <div className={styles.rigthSection}>
          <NotificationsOutlinedIcon />
          <UserAvatar
            onClick={() => openMenu(!menuIsOpen)}
            addClass={styles.avatar}
            textclass={styles.textclassAvatar}
            avatar={currentUser.profilePic}
            name={currentUser.username}
            def_size_ico={30}
            tabletmode={styles.tabletNavbar}
          />
          <MenuUser 
            isVisible={menuIsOpen}
            setVisible={openMenu}
            curUser={currentUser}
            curTheme={currentTheme}
            position={styles.positionMenuUser}
          />
      </div>

      {isMobile &&
        <>
        <BurgerElement 
          isOpenMobileMenu={menuIsOpen}
          openMobileMenu={openMenu}
          currentTheme={currentTheme}
        />
        <MobileMenu
          isOpenMobileMenu={menuIsOpen}
          openMobileMenu={openMenu}
        />
        </>
      }
    </div>
  )
});

export default Navbar;
