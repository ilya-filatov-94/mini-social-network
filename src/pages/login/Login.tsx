import { FC, useState, ChangeEvent, UIEvent } from 'react';
import styles from './Login.module.scss';

import Button from '../../components/Button/Button';
import ButtonLink from '../../components/ButtonLink/ButtonLink';
import Input from '../../components/Input/Input';

import { useNavigate } from "react-router-dom";
import {useDispatch} from 'react-redux';
import {loginUser} from '../../store/authSlice';
import {ILoginData} from '../../types/form';



const Login: FC = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [loginData, setLoginData] = useState<ILoginData>({
    nickname: '',
    password: ''
  });

  function handleInputs(event: ChangeEvent<HTMLInputElement>) {
    setLoginData(prev => ({...prev, [event.target.name]: event.target.value}))
  }

  function handleLogin(event: UIEvent) {
    event.preventDefault();
    dispatch(loginUser(loginData));
    navigate('/', {replace: true});
  }

  return (
    <div className={styles.login}>
      <div className={styles.card}>
        <div className={styles.leftSection}>
          <h1>Добро пожаловать!</h1>
          <p>Сайт IFriends - интернет-ресурс, который помогает вам поддерживать связь 
            с вашими старыми и новыми друзьями. 
            Это сетевой проект, объединяющий людей на основании мест учебы или работы.
          </p>
          <span>
            У вас нет аккаунта?
          </span>
          <ButtonLink addClass={styles.regButton} to={"/register"}>
            Регистрация
          </ButtonLink>
        </div>

        <div className={styles.rightSection}>
          <h1>
            Вход
          </h1>
          <form>
            <Input 
              onChange={handleInputs}
              type="text" 
              placeholder="Никнейм пользователя"
              name="nickname"
            />
            <Input 
              onChange={handleInputs}
              type="password" 
              placeholder="Пароль"
              name="password"
            />
            <Button 
              onClick={handleLogin}
              addClass={styles.loginButton}
            >
              Войти
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
}

export default Login
