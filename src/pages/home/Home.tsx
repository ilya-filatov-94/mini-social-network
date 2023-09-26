import {ReactElement} from 'react';
import styles from './Home.module.scss';

import { useLocation, useNavigate } from "react-router-dom";
import {useDispatch} from 'react-redux';
import {logoutUser} from '../../store/authSlice';



const Home = (): ReactElement => {

  const navigate = useNavigate();
  const location = useLocation();
  const fromPage = location.state?.from?.pathname || '/';
  const dispatch = useDispatch();

  function handleLogout() {
    dispatch(logoutUser());
    navigate(fromPage, {replace: true});
  }

  return (
    <div className={styles.home}>
      Пёс
      <button onClick={handleLogout}>Выйти</button>
    </div>
  )
}

export default Home
