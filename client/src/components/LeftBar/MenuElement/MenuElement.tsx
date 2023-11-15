import {FC} from 'react'
import styles from './MenuElement.module.scss';
import { Link } from "react-router-dom";

interface IMenuElement {
  image?: string | undefined; 
  textElem: string;
  menuRef: string;
  [key: string]: string | number | (() => void) | undefined;
}

const MenuElement: FC<IMenuElement> = ({
  image, 
  textElem,
  menuRef,
  ...props
}) => {
  return (
    <Link className={styles.link} to={menuRef}>
      <div {...props} className={styles.menuElem}>
        <img
          className={styles.iconMenu}
          src={image}
          alt={`${textElem} menu element`}
        />
        <span className={styles.styleText}>{textElem}</span>
      </div>
    </Link>
  );
}

export default MenuElement
