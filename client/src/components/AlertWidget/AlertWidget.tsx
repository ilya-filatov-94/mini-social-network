import {FC} from 'react';
import styles from './AlertWidget.module.scss';
import {FetchBaseQueryError} from "@reduxjs/toolkit/query/react";
import ErrorOutlineOutlinedIcon from '@mui/icons-material/ErrorOutlineOutlined';

interface IAlertProps {
    error: FetchBaseQueryError | boolean;
    errorMessage?: string;
    addClass?: string;
}

const AlertWidget: FC<IAlertProps> = ({error, errorMessage, addClass}) => {

  function isFetchBaseQueryError(error: unknown): error is FetchBaseQueryError {
    return typeof error === 'object' && error != null && 'status' in error
  }

  if (isFetchBaseQueryError(error)) {
    return (
    <div className={`${addClass ? `${addClass} ${styles.isError}` : styles.isError}`}>
        <div className={styles.MuiAlert}>
            <ErrorOutlineOutlinedIcon sx={{ marginTop: -0.1, fontSize: "1rem" }}/>
        </div>
        <span>{errorMessage ? errorMessage : 'Ошибка!'} {error.status}</span>
    </div>
  )}
  else {
    return (
        <div className={`${addClass ? `${addClass} ${styles.isError}` : styles.isError}`}>
            <div className={styles.MuiAlert}>
                <ErrorOutlineOutlinedIcon sx={{ marginTop: -0.1, fontSize: "1rem" }}/>
            </div>
            <span>{errorMessage ? errorMessage : 'Ошибка!'}</span>
        </div>
    )
  }
}

export default AlertWidget;
