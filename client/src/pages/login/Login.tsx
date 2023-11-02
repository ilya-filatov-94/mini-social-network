import {
  FC, 
  useState, 
  useEffect, 
  ChangeEvent, 
  FormEventHandler
} from 'react';
import styles from './Login.module.scss';

import ButtonLink from '../../components/ButtonLink/ButtonLink';
import InputWithValidation from '../../components/InputWithValidation/InputWithValidation';
import LoadingButton from '../../components/LoadingButton/LoadingButton';

import { useNavigate } from "react-router-dom";
import {useAppDispatch, useAppSelector} from '../../hooks/useTypedRedux';
import {loginUser, setErrorStatus} from '../../store/authSlice';
import {useMatchMedia} from '../../hooks/useMatchMedia';
import {useScroll} from '../../hooks/useScroll';

interface IStatusValidData {
  [key: string]: boolean;
}

interface ILoginValue {
  [key: string]: string;
}

const Login: FC = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const {isAuth, status, error} = useAppSelector(state => state.reducerAuth);

  useEffect(() => {
    if (isAuth && status === 'resolved') {
      navigate('/', {replace: true});
    }
    if (error) {
      console.log(error);
      console.log(status);
      if (status === '403' && error.includes('Пользователь с почтовым адресом')) {
        setValidInput({...isValidInputs, email: false});
      }
      if (status === '403' && error === 'Неверный пароль') {
        setValidInput({...isValidInputs, password: false});
      }
    }
  // eslint-disable-next-line
  }, [status, error]);
  

  const [executeScroll, elRef] = useScroll();
  const {isMobile} = useMatchMedia();

  useEffect(() => {
    if (isMobile) {
      executeScroll();
    }
  // eslint-disable-next-line
  }, []);

  const [loginData, setLoginData] = useState<ILoginValue>({
    email: '',
    password: ''
  });

  const [isValidInputs, setValidInput] = useState<IStatusValidData>({
    email: false,
    password: false,
  });

  const isValidForm = isValidInputs.email && isValidInputs.password;

  function handleInputs(event: ChangeEvent<HTMLInputElement>) {
    setLoginData(prev => ({...prev, [event.target.name]: event.target.value}));
    if (status === '403') {
      dispatch(setErrorStatus(undefined))
    }
  }

  const handleLogin: FormEventHandler<HTMLFormElement> = (event) => {
    event.preventDefault();
    dispatch(loginUser({
      email: loginData.email,
      password: loginData.password
    }));
  }

  function addFnValidation() {
    if (status === '403') {
      return error as string;
    }
    return '';
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
            <InputWithValidation
              classes={styles.inputForm}
              value={loginData.email}
              name="email"
              type="text"
              required
              placeholder="Электронная почта"
              isValidInput={isValidInputs.email}  
              setValidInput={setValidInput}
              funValidation={{customFun: addFnValidation}}
              onChange={handleInputs}
              validations={{checkEmail: true}}
            />
            <InputWithValidation
              classes={styles.inputForm}
              value={loginData.password}
              name="password"
              type="password"
              required
              placeholder="Пароль"
              autoComplete="false"
              isValidInput={isValidInputs.password}  
              setValidInput={setValidInput}
              funValidation={{customFun: addFnValidation}}
              onChange={handleInputs}
              validations={{
                lettersDfferentRegisters: true,
                hasDigit: true,
                minLength: 6,
                maxLength: 32,
              }}
            />
            <LoadingButton
              type="submit"
              loading={status === 'loading'}
              disabled={!isValidForm}
              text="Войти"
              classes={styles.loginButton}
            />
          </form>
        </div>
      </div>
    </div>
  );
}

export default Login
