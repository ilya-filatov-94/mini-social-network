import {FC} from 'react';
import styles from './MobileMenuItem.module.scss';
import noAvatar from '../../../../assets/images/no-avatar.jpg';
import { Link } from "react-router-dom";
import {IMenu} from '../../../../types/menu';

interface IMobileMenuItemProps {
  item: IMenu;
  avatarStyle?: string;
  currentTheme: string;
  [key: string]: any;
}

const MobileMenuItem: FC<IMobileMenuItemProps> = ({
  item, 
  avatarStyle, 
  currentTheme, 
  ...props
}) => {
  return (
    <div {...props}
    className={currentTheme ==='darkMode'
      ? `${styles.menuItem} ${styles['theme-dark']}`
      : `${styles.menuItem} ${styles['theme-light']}`
    }>
      <Link className={styles.link} to={item.menuRef || ''}>
        <img
          className={avatarStyle ? `${styles.iconElem} ${avatarStyle}` : styles.iconElem}
          src={item.image ? item.image : noAvatar}
          alt={`Menu ${item.name}`}
        />
        <div>
          <span>{item.name}</span>
        </div>
      </Link>
    </div>
  );
}

export default MobileMenuItem;
