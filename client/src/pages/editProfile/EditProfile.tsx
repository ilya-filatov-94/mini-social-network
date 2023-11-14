import {
  FC, 
  useState,
  MutableRefObject,
  FormEventHandler,
  ChangeEvent
} from 'react';
import styles from './EditProfile.module.scss';
import {useParams} from "react-router-dom";
import {useAppSelector} from '../../hooks/useTypedRedux';
import {IUserFullData} from '../../types/users';
import {useGetUserDataQuery, useUpdateUserMutation} from '../../services/UserService';
import { 
    FetchBaseQueryError,
} from "@reduxjs/toolkit/query/react";
import {useAppDispatch} from '../../hooks/useTypedRedux';
import {updateUserData} from '../../store/authSlice';
import Loader from '../../components/Loader/Loader';
import Alert from '@mui/material/Alert';
import InputSettings from './InputSettings/InputSettings';
import LoadingButton from '../../components/LoadingButton/LoadingButton';
import noAvatar from '../../assets/images/no-avatar.jpg';
import {inputs} from './editUserInputs';


type TPreviewImg = string | ArrayBuffer | null;

const EditProfile: FC = () => {
  const {ref} = useParams();
  const {data: userData, error: errorLoading, isLoading: isLoadingData} = useGetUserDataQuery(ref as string);
  const [updateUser, {isLoading: isLoadingUpdate, error: errorUpdate}] = useUpdateUserMutation();
  const isFetchBaseQueryErrorType = (error: any): error is FetchBaseQueryError => 'status' in error;
  const currentTheme = useAppSelector(state => state.reducerTheme.themeMode);
  const [selectedAvatar, setSelectedAvatar] = useState<File>();
  const [previewAvatar, setPreviewAvatar] = useState<TPreviewImg>();
  const [selectedCover, setSelectedCover] = useState<File>();
  const [previewCover, setPreviewCover] = useState<TPreviewImg>();
  const dispatch = useAppDispatch();

  const initUserData = {
    name: '',
    lastname: '',
    city: '',
    website: '',
    email: '',
    password: '',
  }

  const [newUserData, setNewUserData] = useState(initUserData);

  const [isValidInputs, setValidInput] = useState({
    name: true,
    lastname: true,
    city: true,
    website: true,
    email: true,
    password: true,
  });

  const setValueinForm = (ref: MutableRefObject<null | HTMLInputElement>, error: string) => {
    if (ref.current) {
      setNewUserData({...newUserData, [ref.current.name]: ref.current.value});
      setValidInput({...isValidInputs, [ref.current.name]: !error});
    }
  }
  const isValidForm = Object.entries(isValidInputs).every(key => key[1]);

  const onSubmit: FormEventHandler<HTMLFormElement & IUserFullData> = async (event) => {
    event.preventDefault();
    const formData = new FormData();
    formData.append('id', `${userData?.id}`);
    formData.append('email', newUserData?.email || userData?.email || '');
    formData.append('password', newUserData?.password);

    let newUsername = '';
    let newRef;
    if (newUserData.name !== '' && newUserData.lastname !== '') {
      newUsername = newUserData?.name + ' ' + newUserData?.lastname;
      newRef = newUsername.replace(' ', '') + userData?.id;
      formData.append('username', newUsername);
      formData.append('refUser', newRef);
    }
    if (newUserData.name !== '' && newUserData.lastname === '') {
      newUsername = `${newUserData?.name} ${userData?.lastname}`;
      newRef = newUsername.replace(' ', '') + userData?.id;
      formData.append('username', newUsername);
      formData.append('refUser', newRef);
    }
    if (newUserData.name === '' && newUserData.lastname !== '') {
      newUsername = `${userData?.name} ${newUserData?.lastname}`;
      newRef = newUsername.replace(' ', '') + userData?.id;
      formData.append('username', newUsername);
      formData.append('refUser', newRef);
    }
    formData.append('profilePic', (selectedAvatar || ''));
    formData.append('coverPic', (selectedCover || ''));
    formData.append('city', (newUserData.city || 'Не указан'));
    formData.append('website', (newUserData.website || 'Отсутствует'));

    const emptyNewData = Object.entries(newUserData)
      .every(item => item[1] === '')
      && !(selectedAvatar && selectedCover);
    
    if (emptyNewData) return;
    // setNewUserData(initUserData);
    const Test = await updateUser(formData).unwrap();
    console.log(Test);
    
    // if (newRef) {
    //   dispatch(updateUserData({
    //     username: newUsername,
    //     refUser: newRef!
    //   }));
    // }
  }

  function handleImagePost(event: ChangeEvent<HTMLInputElement>) {
    if (event.target.files) {
      let file = event.target.files[0];
      if (!file.type.match('image')) return;
      const reader = new FileReader();      
      if (event.target.name === "profilePic") {
        setSelectedAvatar(file);
        reader.onloadend = () => setPreviewAvatar(reader.result);
      }
      if (event.target.name === "coverPic") {
        setSelectedCover(file);
        reader.onloadend = () => setPreviewCover(reader.result);
      }
      reader.readAsDataURL(file);
    }
  }

  if (isLoadingData || isLoadingUpdate) {
    return <Loader />
  }

  if (errorLoading || errorUpdate) {
    if (isFetchBaseQueryErrorType(errorLoading)) {
      return ( 
      <Alert severity="error" sx={{m: 20}}>
        Произошла ошибка при загрузке данных! {errorLoading.status}
      </Alert>);
    }
    if (isFetchBaseQueryErrorType(errorUpdate)) {
      return ( 
      <Alert severity="error" sx={{m: 20}}>
        Произошла ошибка при загрузке данных! {errorUpdate.status}
      </Alert>);
    }
  }
  
  if (userData && !(errorLoading || errorUpdate)) {
  return (
    <div className={currentTheme ==='darkMode'
        ? `${styles.settingsContainer} ${styles['theme-dark']}`
        : `${styles.settingsContainer} ${styles['theme-light']}`
        }>
        <div className={styles.wrapperSettings}>
            <div className={styles.header}>
                <h1>Редактирование профиля</h1>
            </div>

            <form className={styles.updateProfile} onSubmit={onSubmit}>
                <div className={styles.fieldImg}>
                    <img 
                        className={styles.preview} 
                        src={previewAvatar ? previewAvatar : noAvatar}
                        alt={`avatar of ${userData?.name}`} 
                    />
                    <div className={styles.wrapperFileInput}>
                        <p className={styles.headerFileInput}>Аватар</p>
                        <label htmlFor="avatarImg" className={styles.btnFileInput}>Выбрать изображение</label>
                        <p className={styles.requirementFile}>
                            Изображение должно быть в одном из форматов: .jpeg, .jpg, .png
                        </p>
                        <input
                          onChange={handleImagePost}
                          className={styles.fileInput}
                          type="file"
                          accept=".jpeg, .jpg, .png"
                          id="avatarImg"
                          name="profilePic"
                        />
                    </div>
                </div>
                <div className={styles.fieldImg}>
                    {previewCover 
                    ? <img
                        className={styles.previewCover}
                        src={previewCover as string}
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
                          onChange={handleImagePost}
                          className={styles.fileInput}
                          type="file"
                          accept=".jpeg, .jpg, .png"
                          id="coverImg"
                          name="coverPic"
                        />
                    </div>
                </div>
                {inputs.map((input) => 
                  <InputSettings
                    key={input.idInput}
                    defaultValue={userData[input.name as keyof typeof userData]}
                    isError={{name: input.name, message: ""}}
                    setValueinForm={setValueinForm}
                    classes={styles.inputForm}
                    {...input}
                  />
                )}
                <div className={styles.wrapperSaveBtn}>
                  <LoadingButton
                    type="submit"
                    loading={isLoadingData || isLoadingUpdate}
                    disabled={!isValidForm}
                    text="Сохранить"
                    classes={styles.saveButton}
                  />
                </div>
            </form>

        </div>
      </div>
  )
} else return <Alert severity="error" sx={{m: 20}}>{JSON.stringify(errorLoading || errorUpdate)}</Alert>
}

export default EditProfile;
