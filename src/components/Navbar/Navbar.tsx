import {FC, useState } from 'react';
import styles from './Navbar.module.scss';

import {useAppDispatch, useAppSelector} from '../../hooks/useTypedRedux';
import {switchTheme} from '../../store/themeSlice';
import Logo from '../Logo/Logo';
import { useNavigate} from "react-router-dom";
import Input from '../Input/Input';
import UserAvatar from '../UserAvatar/UserAvatar';
import MenuUser from './MenuUser/MenuUser';
import BurgerElement from './BurgerElement/BurgerElement';
import MobileMenu from './MobileMenu/MobileMenu';
import {useMatchMedia} from '../../hooks/useMatchMedia';

import HomeOutlinedIcon from '@mui/icons-material/HomeOutlined';
import DarkModeOutlinedIcon from '@mui/icons-material/DarkModeOutlined';
import GridViewOutlinedIcon from '@mui/icons-material/GridViewOutlined';
import WbSunnyOutlinedIcon from '@mui/icons-material/WbSunnyOutlined';
import NotificationsOutlinedIcon from '@mui/icons-material/NotificationsOutlined';
import EmailOutlinedIcon from '@mui/icons-material/EmailOutlined';
import SearchOutlinedIcon from '@mui/icons-material/SearchOutlined';



const Navbar: FC = () => {

  const {isMobile} = useMatchMedia();

  const navigate = useNavigate();
  const currentTheme = useAppSelector(state => state.reducerTheme.themeMode);
  const currentUser = useAppSelector(state => state.reducerAuth.currentUser);
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
        <GridViewOutlinedIcon />

        <div className={styles.search}>
          <SearchOutlinedIcon />
          <Input addClass={styles.inputSearch} type="search" placeholder="Поиск..."/>
        </div>
      </div>


      <div className={styles.rigthSection}>
          <EmailOutlinedIcon />
          <NotificationsOutlinedIcon />

          <UserAvatar
            onClick={() => openMenu(!menuIsOpen)}
            addClass={styles.avatar}
            textclass={styles.textclassAvatar}
            avatar={currentUser.profileImg}
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
}

export default Navbar;
