import {
  FC, 
  useState,
  useRef,
  MutableRefObject,
  FormEventHandler,
  ChangeEvent,
  useEffect
} from 'react';
import styles from './EditProfile.module.scss';
import {useParams} from "react-router-dom";
import {useAppSelector} from '../../hooks/useTypedRedux';
import { shallowEqual } from 'react-redux';
import {RootState} from '../../store';
import {useGetUserDataQuery, useUpdateUserDataMutation} from '../../services/UserService';
import {FetchBaseQueryError} from "@reduxjs/toolkit/query/react";
import {useAppDispatch} from '../../hooks/useTypedRedux';
import {updateUser} from '../../store/authSlice';
import { useNavigate } from "react-router-dom";
import Loader from '../../components/Loader/Loader';
import Alert from '@mui/material/Alert';
import InputSettings from './InputSettings/InputSettings';
import LoadingButton from '../../components/LoadingButton/LoadingButton';
import noAvatar from '../../assets/images/no-avatar.jpg';
import {inputs} from './editUserInputs';
import CheckCircleOutlineOutlinedIcon from '@mui/icons-material/CheckCircleOutlineOutlined';
import {urlAPIimages} from '../../env_variables';
import infoClient from '../../helpers/detectBrowserData';


type TPreviewImg = string | ArrayBuffer | null;

const EditProfile: FC = () => {
  const currentTheme = useAppSelector((state: RootState) => state.reducerTheme.themeMode, shallowEqual);
  const {ref} = useParams();
  const newRefUser = useRef(ref);
  const {
    data: userData, 
    error: errorLoading, 
    isLoading: isLoadingData
  } = useGetUserDataQuery(
    newRefUser.current as string,
  );
  const [updateUserData, 
    {
      isLoading: isLoadingUpdate,
      error: errorUpdate,
      isSuccess
    }] = useUpdateUserDataMutation();
  const isFetchBaseQueryErrorType = (error: any): error is FetchBaseQueryError => 'status' in error;
  const [selectedAvatar, setSelectedAvatar] = useState<File>();
  const [previewAvatar, setPreviewAvatar] = useState<TPreviewImg>();
  const [selectedCover, setSelectedCover] = useState<File>();
  const [previewCover, setPreviewCover] = useState<TPreviewImg>();
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  useEffect(() => {
    infoClient().then(data => console.log(data));
  }, []);
  
  useEffect(() => {
    if (userData?.profilePic) {
      dispatch(updateUser({
        profilePic: userData?.profilePic
      }));
    }
  }, [userData, dispatch]);

  const getPreviewOfSelectedImages = () => {
    const previewOfSelectedImages = {avatar: '', cover: ''};
    if (previewAvatar) {
      previewOfSelectedImages.avatar = previewAvatar as string;
    }
    if (!previewAvatar && userData?.profilePic) {
      previewOfSelectedImages.avatar = urlAPIimages + userData?.profilePic;
    }
    if (!previewAvatar && !userData?.profilePic) {
      previewOfSelectedImages.avatar = noAvatar;
    }
    
    if (previewCover) {
      previewOfSelectedImages.cover = previewCover as string;
    }
    if (!previewCover && userData?.coverPic) {
      previewOfSelectedImages.cover = urlAPIimages + userData?.coverPic;
    }
    return previewOfSelectedImages;
  }
  const previewSelectedImages = getPreviewOfSelectedImages();
  
  const [newUserData, setNewUserData] = useState({
    name: '',
    lastname: '',
    city: '',
    website: '',
    email: '',
    password: '',
  });

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

  const onSubmit: FormEventHandler<HTMLFormElement> = async (event) => {
    event.preventDefault();
    const formData = new FormData();
    formData.append('id', `${userData?.id}`);
    formData.append('email', newUserData?.email);
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
    if (selectedAvatar) formData.append('profilePic', selectedAvatar);
    if (selectedCover) formData.append('coverPic', selectedCover);
    formData.append('city', newUserData.city);
    formData.append('website', newUserData.website);

    const emptyNewData = Object.entries(newUserData)
      .every(item => item[1] === '')
      && !selectedAvatar && !selectedCover;
    
    if (emptyNewData) return;
    await updateUserData(formData);
    if (newRef) {
      dispatch(updateUser({
        username: newUsername,
        refUser: newRef
      }));
      newRefUser.current = newRef;
      navigate(`/profile/${newRefUser.current}/edit`, {replace: true});
    }
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
      <div className={styles.wrapper}>
        <div className={styles.wrapperSettings}>
            <div className={styles.header}>
                <h1>Редактирование профиля</h1>
                {isSuccess && 
                <div className={styles.successUpdate}>
                  <div className={styles.MuiAlert}><CheckCircleOutlineOutlinedIcon/></div>
                  <span>Данные успешно обнолены</span>
                </div>}
            </div>

            <form className={styles.updateProfile} onSubmit={onSubmit}>
                <div className={styles.fieldImg}>
                    <img 
                        className={styles.preview} 
                        src={previewSelectedImages.avatar}
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
                    {previewSelectedImages.cover 
                    ? <img
                        className={styles.previewCover}
                        src={previewSelectedImages.cover}
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
    </div>
  )
} else return <Alert severity="error" sx={{m: 20}}>{JSON.stringify(errorLoading || errorUpdate)}</Alert>
}

export default EditProfile;
