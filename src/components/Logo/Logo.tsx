import {FC} from 'react';
import styles from './Logo.module.scss';


interface ILogoProps {
	themeMode: string;
};

const Logo: FC<ILogoProps> = ({themeMode}) => {
  return (
      <div 
        className={themeMode === 'darkMode'
          ? `${styles.logoText} ${styles['theme-dark']}`
          : styles.logoText
        }
      >
        <span>IFriends</span>
      </div>
  );
}

export default Logo
