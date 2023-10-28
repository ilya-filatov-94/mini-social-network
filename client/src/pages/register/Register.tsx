import { 
  FC, 
  useState, 
  useEffect,
  ChangeEvent,
  FormEventHandler
} from 'react';
import styles from './Register.module.scss';
import { useNavigate } from "react-router-dom";
import {useAppDispatch} from '../../hooks/useTypedRedux';
// import {useAppSelector} from '../../hooks/useTypedRedux';
import {registerUser} from '../../store/authSlice';
import {useMatchMedia} from '../../hooks/useMatchMedia';
import {useScroll} from '../../hooks/useScroll';

import Button from '../../components/Button/Button';
import ButtonLink from '../../components/ButtonLink/ButtonLink';
import Input from '../../components/Input/Input';
import {IRegData} from '../../types/form';





const Register: FC = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();

  // const {loading, error} = useAppSelector(state => state.reducerAuth);

  const {isMobile} = useMatchMedia();
  const [executeScroll, elRef] = useScroll();

  useEffect(() => {
    if (isMobile) {
      executeScroll();
    }
  // eslint-disable-next-line
  }, []);

  const [regData, setRegData] = useState<IRegData>({
    name: '',
    lastname: '',
    email: '',
    password: '',
  });

  const [isValidInputs, setValidInput] = useState({
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
  }

  const handleRegister: FormEventHandler<HTMLFormElement> = (event) => {
    event.preventDefault();
    dispatch(registerUser({
      username: regData.name + ' ' + regData.lastname,
      email: regData.email,
      password: regData.password,
    }));
    navigate('/', {replace: true});
  }

  return (
    <div className={styles.register}>
      <div className={styles.card}>
        <div className={styles.leftSection}>
          <h1 ref={elRef}>Регистрация</h1>
          <form onSubmit={handleRegister}>
            <Input 
             onChange={handleInputs}
             addClass={styles.inputForm}
             type="text"
             placeholder="Имя"
             name="name"
             required
            />
            <Input 
              onChange={handleInputs}
              addClass={styles.inputForm}
              type="text" 
              placeholder="Фамилия" 
              name="lastname"
              required
            />
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
            />
            <Button addClass={styles.regButton}>
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
