import { 
  FC, 
  useState, 
  useEffect,
  ChangeEvent,
  FormEventHandler
} from 'react';
import styles from './Register.module.scss';
import {useNavigate} from "react-router-dom";
import {useAppDispatch, useAppSelector} from '../../hooks/useTypedRedux';
import { shallowEqual } from 'react-redux';
import {registerUser, setErrorStatus} from '../../store/authSlice';
import {useMatchMedia} from '../../hooks/useMatchMedia';
import LoadingButton from '../../components/LoadingButton/LoadingButton';
import ButtonLink from '../../components/ButtonLink/ButtonLink';
import InputWithValidation, {TStatusValidData} from '../../components/InputWithValidation/InputWithValidation';
import {inputs} from './regInputs';

interface IRegValue {
  name: string;
  lastname: string;
  email: string;
  password: string;
}

const Register: FC = () => {
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
      if (status === '403') {
        setValidInput({...isValidInputs, email: false});
      }
    }
  }, [status, error]);

  const [regData, setRegData] = useState<IRegValue>({
    name: '',
    lastname: '',
    email: '',
    password: '',
  });
  const [isValidInputs, setValidInput] = useState<TStatusValidData>({
    name: false,
    lastname: false,
    email: false,
    password: false,
  });
  const isValidForm = Object.entries(isValidInputs).every(key => key[1]);

  function handleInputs(event: ChangeEvent<HTMLInputElement>) {
    setRegData(prev => ({...prev, [event.target.name]: event.target.value}))
    if (status === '403') {
      dispatch(setErrorStatus(undefined))
    }
  }

  const handleRegister: FormEventHandler<HTMLFormElement> = (event) => {
    event.preventDefault();
    dispatch(registerUser({
      username: regData.name + ' ' + regData.lastname,
      email: regData.email,
      password: regData.password,
    }));
  }

  function addFnValidation(inputName: string) {
    if (inputName === 'email') {
      return {
        customFun: function() {
          if (status === '403') {
            return error as string;
          }
          return '';
        }
      }
    }
    return {customFun: undefined};
  }

  return (
    <div className={styles.register}>
      <div className={styles.card}>
        <div className={styles.leftSection}>
        {(isMobile || isTablet) && (
          <div>
            <h1>IFriends</h1>
            <h2>Регистрация</h2>
          </div>
        )}
        {isDesktop && (
          <h1>Регистрация</h1>
        )}
          <form onSubmit={handleRegister}>
            {inputs.map((input) => 
              <InputWithValidation
                key={input.idInput}
                classes={styles.inputForm}
                maxLength={100}
                value={regData[input.name as keyof typeof regData]}
                isValidInput={isValidInputs[input.name]}  
                setValidInput={setValidInput}
                funValidation={addFnValidation(input.name)}
                onChange={handleInputs}
                {...input}
              />
            )}
            {(isMobile || isTablet) && (
              <div className={styles.wrapperButton}>
                <LoadingButton
                  type="submit"
                  loading={status === 'loading'}
                  disabled={!isValidForm}
                  text="Зарегистрироваться"
                  classes={styles.regButton}
                />
                <ButtonLink addClass={styles.regButton} to={"/login"}>
                  Войти
                </ButtonLink>
              </div>
            )}
            {(isDesktop) && (
              <LoadingButton
              type="submit"
              loading={status === 'loading'}
              disabled={!isValidForm}
              text="Зарегистрироваться"
              classes={styles.regButton}
              />
            )}
          </form>
        </div>
        {(isDesktop) && (
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
        )}
      </div>
    </div>
  );
}

export default Register
