import {FC} from 'react';
import styles from './LoaderMessenger.module.scss';
import CircularProgress from '@mui/material/CircularProgress';

const LoaderMessenger: FC = () => {
  return (
    <div className={styles.loader}>
      <p>Пожалуйста, подождите </p>
      <div>
        <CircularProgress
          color="inherit"
          size={"1rem"}
          sx={{ marginTop: -1 }}
        />
      </div>
    </div>
  );
};

export default LoaderMessenger;
