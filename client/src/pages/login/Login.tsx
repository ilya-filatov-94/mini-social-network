import {
  FC, 
  useState, 
  useEffect, 
  ChangeEvent, 
  FormEventHandler
} from 'react';
import styles from './Login.module.scss';

import Button from '../../components/Button/Button';
import ButtonLink from '../../components/ButtonLink/ButtonLink';
import Input from '../../components/Input/Input';

import { useNavigate } from "react-router-dom";
import {useAppDispatch} from '../../hooks/useTypedRedux';
import {loginUser} from '../../store/authSlice';
import {useMatchMedia} from '../../hooks/useMatchMedia';
import {useScroll} from '../../hooks/useScroll';
import {ILoginData} from '../../types/form';


const Login: FC = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const [executeScroll, elRef] = useScroll();
  const {isMobile} = useMatchMedia();

  useEffect(() => {
    if (isMobile) {
      executeScroll();
    }
  // eslint-disable-next-line
  }, []);

  const [loginData, setLoginData] = useState<ILoginData>({
    email: '',
    password: ''
  });

  function handleInputs(event: ChangeEvent<HTMLInputElement>) {
    setLoginData(prev => ({...prev, [event.target.name]: event.target.value}))
  }

  const handleLogin: FormEventHandler<HTMLFormElement> = (event) => {
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
          <h1 ref={elRef}>
            Вход
          </h1>
          <form onSubmit={handleLogin}>
            <Input 
              onChange={handleInputs}
              addClass={styles.inputForm}
              type="text" 
              placeholder="Электронная почта"
              name="email"
              required
            />
            <Input 
              onChange={handleInputs}
              addClass={styles.inputForm}
              type="password" 
              placeholder="Пароль"
              name="password"
              required
              autoComplete="false"
            />
            <Button addClass={styles.loginButton}>
              Войти
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
}

export default Login
