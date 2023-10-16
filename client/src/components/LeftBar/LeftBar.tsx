import {
  FC, 
  useState,
} from 'react';
import styles from './LeftBar.module.scss';
import {useAppSelector} from '../../hooks/useTypedRedux';

import MenuElement from './MenuElement/MenuElement';
import MenuUser from '../Navbar/MenuUser/MenuUser';
import UserAvatar from '../UserAvatar/UserAvatar';
import {
  basicMenuIcons,
  shortcutsMenuIcons,
  otherMenuIcons
} from './MenuElement/iconsMenu';


const LeftBar: FC = () => {

  const currentTheme = useAppSelector(state => state.reducerTheme.themeMode);
  const currentUser = useAppSelector(state => state.reducerAuth.currentUser);
  const [menuIsOpen, openMenu] = useState<boolean>(false);

  return (
    <div className={currentTheme ==='darkMode'
      ? `${styles.leftBar} ${styles['theme-dark']}`
      : `${styles.leftBar} ${styles['theme-light']}`
    }>
      <div className={styles.container}>

        <div className={styles.menu}>
          <UserAvatar 
            onClick={() => openMenu(!menuIsOpen)}
            addClass={styles.user}
            avatar={currentUser.profilePic}
            name={currentUser.username}
            def_size_ico={30}
            tabletmode={styles.tabletBar}
          />
          <MenuUser 
            isVisible={menuIsOpen}
            setVisible={openMenu}
            curUser={currentUser}
            curTheme={currentTheme}
            position={styles.positionMenuUser}
          />
          {basicMenuIcons.map(item =>
              <MenuElement 
                key={item.id}
                image={item.image} 
                textElem={item.name} 
              />
          )} 
        </div>

        <hr />
        <div className={styles.menu}>
          <span className={styles.styleText}>Развлечения</span>
          {shortcutsMenuIcons.map(item =>
              <MenuElement 
                key={item.id}
                image={item.image} 
                textElem={item.name} 
              />
          )} 
        </div>

        <hr />
        <div className={styles.menu}>
          <span className={styles.styleText}>Разное</span>
          {otherMenuIcons.map(item =>
              <MenuElement 
                key={item.id}
                image={item.image} 
                textElem={item.name} 
              />
          )} 
        </div>

      </div>
    </div>
  );
}

export default LeftBar;




