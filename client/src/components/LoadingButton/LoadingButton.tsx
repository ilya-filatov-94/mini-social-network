import {
    FC,
    memo,
    DetailedHTMLProps, 
    ButtonHTMLAttributes
} from 'react';
import styles from './LoadingButton.module.scss';
import CircularProgress from '@mui/material/CircularProgress';


interface ILoadingButtonProps 
extends DetailedHTMLProps<ButtonHTMLAttributes<HTMLButtonElement>, HTMLButtonElement> {
    loading: boolean;
    text: string;
    classes: string;
    disabled: boolean;
}

const LoadingButton: FC<ILoadingButtonProps> = memo (({
    loading,
    text,
    classes,
    disabled,
    ...props
}) => {

  const rootStyles = [classes];
  if (loading) {
    rootStyles.push(styles.btn);
  }

  return (
    <button
        {...props}
        disabled={loading || disabled}
        className={rootStyles.join(' ')}
    >
        <p>{loading ? "Подождите" : text}</p>
        {loading &&
        <div>
            <CircularProgress 
                color="inherit" 
                size={'1rem'} 
                sx={{marginTop: -1}}
            />
        </div>}
    </button>
  )
});

export default LoadingButton;
