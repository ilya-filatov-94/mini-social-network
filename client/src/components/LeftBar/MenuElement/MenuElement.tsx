import {FC, useMemo} from 'react'
import styles from './MenuElement.module.scss';
import { Link } from "react-router-dom";

interface IMenuElement {
  image?: string; 
  textElem: string;
  menuRef: string;
  counterUnreadMsgs?: Record<string, number>;
}

const MenuElement: FC<IMenuElement> = ({
  image, 
  textElem,
  menuRef,
  counterUnreadMsgs,
  ...props
}) => {

  const summUnreadMessages = useMemo(() => {
    let counterMsgs = 0;
    if (counterUnreadMsgs) {
      for (const key in counterUnreadMsgs) {
        counterMsgs += counterUnreadMsgs[key];
      }
    }
    return counterMsgs;
  }, [counterUnreadMsgs])

  return (
    <Link className={styles.link} to={menuRef}>
      <div {...props} className={styles.menuElem}>
        <img
          className={styles.iconMenu}
          src={image}
          alt={`${textElem} menu element`}
        />
        <span className={styles.styleText}>{textElem}</span>
        {(menuRef === '/conversations' && !!(summUnreadMessages) && summUnreadMessages > 0) && 
          <div className={styles.counterMsg}>{summUnreadMessages > 99 ? '99+' : summUnreadMessages}</div>
        }
      </div>
    </Link>
  );
}

export default MenuElement
