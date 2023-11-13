import {FC, useState, useEffect, ChangeEvent} from 'react';
import styles from './EditProfile.module.scss';
import {useParams} from "react-router-dom";
import {useAppSelector} from '../../hooks/useTypedRedux';
import {IUserFullData} from '../../types/users';
import {useGetUserDataQuery} from '../../services/UserService';
import { 
    FetchBaseQueryError,
  } from "@reduxjs/toolkit/query/react";
import Loader from '../../components/Loader/Loader';
import Alert from '@mui/material/Alert';
import InputWithValidation from '../../components/InputWithValidation/InputWithValidation';
import LoadingButton from '../../components/LoadingButton/LoadingButton';
import noAvatar from '../../assets/images/no-avatar.jpg';
import {inputs} from './editUserInputs';

interface IStatusValidData {
    [key: string]: boolean;
}

const EditProfile: FC = () => {
  const {ref} = useParams();
  const {data: userData, error, isLoading} = useGetUserDataQuery(ref as string, {skip: !ref});
  const isFetchBaseQueryErrorType = (error: any): error is FetchBaseQueryError => 'status' in error;
  const currentTheme = useAppSelector(state => state.reducerTheme.themeMode);

  console.log(userData);

  const [newUserData, setNewUserData] = useState<IUserFullData>({
    name: '',
    lastname: '',
    city: '',
    website: '',
    email: '',
    password: '',
  });

  useEffect(() => {
    if (userData) {
        setNewUserData({...newUserData, name: userData.name});
    }

  }, [userData])

  const [isValidInputs, setValidInput] = useState<IStatusValidData>({
    name: false,
    lastname: false,
    city: false,
    website: false,
    email: false,
    password: false,
  });

  const isValidForm = isValidInputs.name &&
                      isValidInputs.lastname &&
                      isValidInputs.email &&
                      isValidInputs.password;

  function handleInputs(event: ChangeEvent<HTMLInputElement>) {
    setNewUserData(prev => ({...prev, [event.target.name]: event.target.value}))
  }

  if (isLoading) {
    return <Loader />
  }

  if (error) {
    if (isFetchBaseQueryErrorType(error)) {
      return <Alert severity="error" sx={{m: 20}}>Произошла ошибка при загрузке данных! {error.status}</Alert>
    }
  }
  
  if (userData && !error) {
  return (
    <div className={currentTheme ==='darkMode'
        ? `${styles.settingsContainer} ${styles['theme-dark']}`
        : `${styles.settingsContainer} ${styles['theme-light']}`
        }>
        <div className={styles.wrapperSettings}>
            <div className={styles.header}>
                <h1>Редактирование профиля</h1>
            </div>

            <form className={styles.updateProfile}>
                <div className={styles.fieldImg}>
                    <img 
                        className={styles.preview} 
                        src={userData?.profilePic ? userData.profilePic : noAvatar}
                        alt={`avatar of ${userData?.name}`} 
                    />
                    <div className={styles.wrapperFileInput}>
                        <p className={styles.headerFileInput}>Аватар</p>
                        <label htmlFor="avatarImg" className={styles.btnFileInput}>Выбрать изображение</label>
                        <p className={styles.requirementFile}>
                            Изображение должно быть в одном из форматов: .jpeg, .jpg, .png
                        </p>
                        <input
                            className={styles.fileInput}
                            type="file"
                            accept=".jpeg, .jpg, .png"
                            id="avatarImg"
                            name="profilePic"
                        />
                    </div>
                </div>
                <div className={styles.fieldImg}>
                    {userData?.coverPic 
                    ? <img
                        className={styles.previewCover}
                        src={userData?.coverPic}
                        alt={`coverImage of ${userData.name}`}
                      />
                    : <div className={styles.bgNonCover}/>
                    }
                    <div className={styles.wrapperFileInput}>
                        <p className={styles.headerFileInput}>Обложка</p>
                        <label htmlFor="coverImg" className={styles.btnFileInput}>Выбрать изображение</label>
                        <p className={styles.requirementFile}>
                            Изображение должно быть в одном из форматов: .jpeg, .jpg, .png
                        </p>
                        <input
                            className={styles.fileInput}
                            type="file"
                            accept=".jpeg, .jpg, .png"
                            id="coverImg"
                            name="coverPic"
                        />
                    </div>
                </div>
                {inputs.map((input) => 
                  <InputWithValidation
                    key={input.idInput}
                    classes={styles.inputForm}
                    value={newUserData[input.name as keyof typeof newUserData] || ""}
                    isValidInput={isValidInputs[input.name]}  
                    setValidInput={setValidInput}
                    funValidation={{'customFun': undefined}}
                    onChange={handleInputs}
                    {...input}
                  />
                )}
                <div className={styles.wrapperSaveBtn}>
                    <LoadingButton
                    type="submit"
                    loading={isLoading}
                    disabled={!isValidForm}
                    text="Сохранить"
                    classes={styles.saveButton}
                    />
                </div>
            </form>

        </div>
      </div>
  )
} else return <Alert severity="error" sx={{m: 20}}>{JSON.stringify(error)}</Alert>
}

export default EditProfile;
