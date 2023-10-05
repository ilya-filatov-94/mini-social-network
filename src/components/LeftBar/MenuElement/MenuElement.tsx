import {FC} from 'react'
import styles from './MenuElement.module.scss';

interface IMenuElement {
  image?: any; 
  textElem: string;
  [key: string]: string | number | (() => void) | undefined;
}

const MenuElement: FC<IMenuElement> = ({
  image, 
  textElem, 
  ...props
}) => {
  return (
    <div {...props} className={styles.menuElem}>
      <img 
       className={styles.iconMenu}
       src={image} 
       alt={`${textElem} menu element`}
      />
      <span className={styles.styleText}>{textElem}</span>
    </div>
  );
}

export default MenuElement
