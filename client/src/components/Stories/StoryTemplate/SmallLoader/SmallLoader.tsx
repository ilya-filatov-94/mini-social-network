import {FC} from 'react';
import styles from './SmallLoader.module.scss';
import CircularProgress from '@mui/material/CircularProgress';

const SmallLoader: FC = () => {
  return (
    <div className={styles.loader}>
      <p>Подождите</p>
      <div>
        <CircularProgress
          color="inherit"
          size={"0.875rem"}
          sx={{ marginTop: -1 }}
        />
      </div>
    </div>
  );
};

export default SmallLoader;