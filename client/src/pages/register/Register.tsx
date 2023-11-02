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
import {registerUser, setErrorStatus} from '../../store/authSlice';
import {useMatchMedia} from '../../hooks/useMatchMedia';
import {useScroll} from '../../hooks/useScroll';

import LoadingButton from '../../components/LoadingButton/LoadingButton';
import ButtonLink from '../../components/ButtonLink/ButtonLink';
import InputWithValidation from '../../components/InputWithValidation/InputWithValidation';
import {inputs} from './regInputs';

interface IStatusValidData {
  [key: string]: boolean;
}

interface IRegValue {
  name: string;
  lastname: string;
  email: string;
  password: string;
}

const Register: FC = () => {
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
      if (status === '403') {
        setValidInput({...isValidInputs, email: false});
      }
    }
  // eslint-disable-next-line
  }, [status, error]);

  const {isMobile} = useMatchMedia();
  const [executeScroll, elRef] = useScroll();

  useEffect(() => {
    if (isMobile) {
      executeScroll();
    }
  // eslint-disable-next-line
  }, []);

  const [regData, setRegData] = useState<IRegValue>({
    name: '',
    lastname: '',
    email: '',
    password: '',
  });

  const [isValidInputs, setValidInput] = useState<IStatusValidData>({
    name: false,
    lastname: false,
    email: false,
    password: false,
  });

  const isValidForm = isValidInputs.name &&
                      isValidInputs.lastname &&
                      isValidInputs.email &&
                      isValidInputs.password;

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
          <h1 ref={elRef}>Регистрация</h1>
          <form onSubmit={handleRegister}>
            {inputs.map((input) => 
              <InputWithValidation
                key={input.idInput}
                classes={styles.inputForm}
                value={regData[input.name as keyof typeof regData]}
                isValidInput={isValidInputs[input.name]}  
                setValidInput={setValidInput}
                funValidation={addFnValidation(input.name)}
                onChange={handleInputs}
                {...input}
              />
            )}
            <LoadingButton
              type="submit"
              loading={status === 'loading'}
              disabled={!isValidForm}
              text="Зарегистрироваться"
              classes={styles.regButton}
            />
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
