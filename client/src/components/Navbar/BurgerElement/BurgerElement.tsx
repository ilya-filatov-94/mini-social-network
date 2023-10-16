import {FC} from 'react';
import styles from './BurgerElement.module.scss';

interface IBurgerMenuProps {
  isOpenMobileMenu: boolean;
  openMobileMenu:  (state: boolean) => void;
  currentTheme: string;
}

const BurgerElement: FC<IBurgerMenuProps> = ({
  isOpenMobileMenu, 
  openMobileMenu, 
  currentTheme
}) => {

  const rootStyles = [styles.headerBurger];
  if (isOpenMobileMenu) {
    rootStyles.push(styles.active);
  }
  if (currentTheme === 'darkMode') {
    rootStyles.push(styles['theme-dark']);
  } else {
    rootStyles.push(styles['theme-light']);
  }

  return (
    <div 
      className={rootStyles.join(' ')}
      onClick={() => openMobileMenu(!isOpenMobileMenu)}
    >
      <span className={isOpenMobileMenu
      ? `${styles.active_MiddleLine}`
      : `${styles.middleLine}`
      }></span>
    </div>
  )
}

export default BurgerElement
