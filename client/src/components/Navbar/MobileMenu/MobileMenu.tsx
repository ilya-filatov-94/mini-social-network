import {FC} from 'react';
import styles from './MobileMenu.module.scss';
import exitIcon from '../../../assets/images/exit.png'

import {useAppSelector, useAppDispatch} from '../../../hooks/useTypedRedux';
import { shallowEqual } from 'react-redux';
import {logoutUser} from '../../../store/authSlice';
import { useNavigate, useLocation } from "react-router-dom";
import MobileMenuItem from './MobileMenuItem/MobileMenuItem';
import {urlAPIimages} from '../../../env_variables';

import {
  basicMenuIcons,
  shortcutsMenuIcons,
  otherMenuIcons
} from '../../LeftBar/MenuElement/iconsMenu';

interface IMobileMenuProps {
  isOpenMobileMenu: boolean;
  openMobileMenu: (state: boolean) => void;
}

const MobileMenu: FC<IMobileMenuProps> = ({
  isOpenMobileMenu, 
  openMobileMenu
}) => {

  const navigate = useNavigate();
  const location = useLocation();
  const fromPage = location.state?.from?.pathname || '/';
  const dispatch = useAppDispatch();

  const currentTheme = useAppSelector(state => state.reducerTheme.themeMode, shallowEqual);
  const currentUser = useAppSelector(state => state.reducerAuth.currentUser, shallowEqual);

  function handleLogout() {
    dispatch(logoutUser(currentUser.id));
    navigate(fromPage, {replace: true});
  }

  const userMenuItem = {
    name: 'Мой профиль',
    menuRef: `profile/${currentUser.refUser}`,
    image: urlAPIimages+currentUser.profilePic,
  }

  if (isOpenMobileMenu) {
    document.body.style.overflow = "hidden";
  } else {
    document.body.style.overflow = "auto";
  }

  return (
    <div 
      onClick={() => openMobileMenu(!isOpenMobileMenu)}
      className={currentTheme ==='darkMode'
      ? `${styles.container} ${styles['theme-dark']}`
      : `${styles.container} ${styles['theme-light']}`
    }
    >
      <div className={isOpenMobileMenu
        ? `${styles.backDrop} ${styles.backDrop_active}`
        : styles.backDrop}>
      </div>
      <div
        className={
          isOpenMobileMenu
            ? `${styles.linksWrapper} ${styles.openMenu}`
            : `${styles.linksWrapper}`
        }
      >

        <MobileMenuItem 
          key={0}
          item={userMenuItem}
          avatarStyle={styles.avatar}
          currentTheme={currentTheme}
        />

        {basicMenuIcons.map(item =>
          <MobileMenuItem
            key={item.id}
            item={item}
            currentTheme={currentTheme}
          />
        )} 

        {shortcutsMenuIcons.map(item =>
          <MobileMenuItem
            key={item.id}
            item={item}
            currentTheme={currentTheme}
          />
        )}

        {otherMenuIcons.map(item =>
          <MobileMenuItem 
            key={item.id}
            item={item}
            currentTheme={currentTheme}
          />
        )}

        <div
          onClick={handleLogout} 
          className={styles.menuItem}
        >
          <img
            className={styles.iconElem}
            src={exitIcon}
            alt='Exit'
          />
          <div>
            <span>Выйти из профиля</span>
          </div>
      </div>

      </div>
    </div>
  );
}

export default MobileMenu
