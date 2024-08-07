import {
  FC, 
  useState, 
  useEffect, 
  ChangeEvent, 
  FormEventHandler
} from 'react';
import styles from './Login.module.scss';
import ButtonLink from '../../components/ButtonLink/ButtonLink';
import InputWithValidation, {TStatusValidData} from '../../components/InputWithValidation/InputWithValidation';
import LoadingButton from '../../components/LoadingButton/LoadingButton';
import { useNavigate } from "react-router-dom";
import {useAppDispatch, useAppSelector} from '../../hooks/useTypedRedux';
import { shallowEqual } from 'react-redux';
import {loginUser, setErrorStatus} from '../../store/authSlice';
import {useMatchMedia} from '../../hooks/useMatchMedia';

export interface ILoginValue {
  email: string;
  password: string;
}

const Login: FC = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const {isMobile, isTablet, isDesktop} = useMatchMedia();
  const isAuth = useAppSelector(state => state.reducerAuth.isAuth, shallowEqual);
  const status = useAppSelector(state => state.reducerAuth.status, shallowEqual);
  const error = useAppSelector(state => state.reducerAuth.error, shallowEqual);

  useEffect(() => {
    if (isAuth && status === 'resolved') {
      navigate('/', {replace: true});
    }
    if (error) {
      if (status === '403' && error.includes('Пользователь с почтовым адресом')) {
        setValidInput(prev => ({...prev, email: false}));
      }
      if (status === '403' && error === 'Неверный пароль') {
        setValidInput(prev => ({...prev, password: false}));
      }
    }

  }, [
    status, 
    error, 
    navigate, 
    isAuth
  ]);
  
  const [isValidInputs, setValidInput] = useState<TStatusValidData>({
    email: false,
    password: false,
  });
  const [loginData, setLoginData] = useState<ILoginValue>({
    email: '',
    password: ''
  });
  const isValidForm = Object.entries(isValidInputs).every(key => key[1]);

  function handleInputs(event: ChangeEvent<HTMLInputElement>) {
    setLoginData(prev => ({...prev, [event.target.name]: event.target.value}));
    if (status === '403') {
      dispatch(setErrorStatus(undefined));
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
        {(isDesktop) && (
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
        )}
        <div className={styles.rightSection}>
          {(isMobile || isTablet) && (
            <div>
              <h1>IFriends</h1>
              <h2>Вход</h2>
            </div>
          )}
          {isDesktop && (
            <h1>Вход</h1>
          )}
          <form onSubmit={handleLogin}>
            <InputWithValidation
              classes={styles.inputForm}
              value={loginData.email}
              name="email"
              type="text"
              required
              maxLength={100}
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
              maxLength={100}
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
            {(isMobile || isTablet) && (
              <div className={styles.wrapperButton}>
                <LoadingButton
                  type="submit"
                  loading={status === 'loading'}
                  disabled={!isValidForm}
                  text="Войти"
                  classes={styles.loginButton}
                />
                <ButtonLink addClass={styles.loginButton} to={"/register"}>
                  Регистрация
                </ButtonLink>
              </div>
            )}
            {(isDesktop) && (
              <LoadingButton
                type="submit"
                loading={status === 'loading'}
                disabled={!isValidForm}
                text="Войти"
                classes={styles.loginButton}
              />
            )}
          </form>
        </div>
      </div>
    </div>
  );
}

export default Login
