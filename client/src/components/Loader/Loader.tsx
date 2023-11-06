import {FC} from 'react';
import styles from './Loader.module.scss';
import CircularProgress from '@mui/material/CircularProgress';

const Loader: FC = () => {
  return (
    <div className={styles.loader}>
      <p>Идёт загрузка </p>
      <div>
        <CircularProgress
          color="inherit"
          size={"1.5rem"}
          sx={{ marginTop: -1 }}
        />
      </div>
    </div>
  );
};

export default Loader;
