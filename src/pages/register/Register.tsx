import { FC, useState, ChangeEvent, UIEvent } from 'react';
import styles from './Register.module.scss';
import { useNavigate } from "react-router-dom";
import {useDispatch} from 'react-redux';
import {registerUser} from '../../store/authSlice';

import Button from '../../components/Button/Button';
import ButtonLink from '../../components/ButtonLink/ButtonLink';
import Input from '../../components/Input/Input';

import {IRegData} from '../../types/form';


const Register: FC = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [regData, setRegData] = useState<IRegData>({
    nickname: '',
    email: '',
    password: '',
    username: ''
  });

  function handleInputs(event: ChangeEvent<HTMLInputElement>) {
    setRegData(prev => ({...prev, [event.target.name]: event.target.value}))
  }

  const handleLogin = (event: UIEvent) => {
    event.preventDefault();
    dispatch(registerUser(regData));
    navigate('/', {replace: true});
  }

  return (
    <div className={styles.register}>
      <div className={styles.card}>
        <div className={styles.leftSection}>
          <h1>Регистрация</h1>
          <form action="">
            <Input 
             onChange={handleInputs}
             type="text"
             placeholder="Никнейм пользователя"
             name="nickname"
            />
            <Input 
              onChange={handleInputs}
              type="email" 
              placeholder="Электронная почта" 
              name="email"
            />
            <Input 
              onChange={handleInputs}
              type="password" 
              placeholder="Пароль" 
              name="password"
            />
            <Input 
              onChange={handleInputs}
              type="text" 
              placeholder="Ваше имя"
              name="username"
            />
            <Button 
              onClick={handleLogin}
              addClass={styles.regButton}
            >
              Зарегистрироваться
            </Button>
          </form>
        </div>

        <div className={styles.rightSection}>
          <h1>IFriends</h1>
          <p>
            Сайт IFriends - интернет-ресурс, который помогает вам поддерживать
            связь с вашими старыми и новыми друзьями. Это сетевой проект,
            объединяющий людей на основании мест учебы или работы.
          </p>
          <span>Уже есть аккаунт?</span>
          <ButtonLink addClass={styles.loginButton} to={"/login"}>
            Войти
          </ButtonLink>
        </div>
      </div>
    </div>
  );
}

export default Register
