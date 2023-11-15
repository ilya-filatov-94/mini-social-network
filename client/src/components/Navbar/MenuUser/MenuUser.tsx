import {FC} from 'react';
import styles from './MenuUser.module.scss';
import Portal from '../../../hoc/Portal';
import { Link, useNavigate, useLocation } from "react-router-dom";
import {useAppDispatch} from '../../../hooks/useTypedRedux';
import {logoutUser} from '../../../store/authSlice';
import {IinitialUser} from '../../../types/authReducer';

interface IMenuUserProps {
  isVisible: boolean;
  setVisible: (state: boolean) => void;
  curUser: IinitialUser;
  curTheme: string;
  position: string;
}

const MenuUser: FC<IMenuUserProps> = ({
  isVisible, 
  setVisible, 
  curUser, 
  curTheme,
  position,
}) => {

  const navigate = useNavigate();
  const location = useLocation();
  const fromPage = location.state?.from?.pathname || '/';
  const dispatch = useAppDispatch();

  function handleLogout() {
    dispatch(logoutUser(curUser.id));
    navigate(fromPage, {replace: true});
  }

  if (!isVisible) return null;

  return (
    <Portal>
      <div className={styles.menu} onClick={() => setVisible(!isVisible)}>
        <div className={curTheme ==='darkMode'
            ? `${styles.contentWindow} ${position} ${styles['theme-dark']}`
            : `${styles.contentWindow} ${position} ${styles['theme-light']}`
        }
        >
          <Link
            onClick={() => setVisible(!isVisible)}
            className={styles.link}
            to={`profile/${curUser.refUser}`}
          >
            Мой профиль
          </Link>

          <Link
            onClick={() => setVisible(!isVisible)}
            className={styles.link}
            to={`/profile/${curUser.refUser}/edit`}
          >
            Настройки
          </Link>

          <div 
            className={styles.button}
            onClick={handleLogout}
          >
            Выйти
          </div>
        </div>
      </div>
    </Portal>
  );
}

export default MenuUser

