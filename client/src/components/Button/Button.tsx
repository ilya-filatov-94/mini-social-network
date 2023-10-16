import {
  FC,
  HTMLAttributes,
  ReactNode
} from 'react';
import styles from './Button.module.scss';


interface ISpreadingButtonProps
  extends HTMLAttributes<HTMLButtonElement> {
  addClass?: string;
  children: ReactNode;
}


const Button: FC<ISpreadingButtonProps> = ({ 
  addClass, 
  children, 
  ...props 
}) => {
  return (
    <button
      {...props}
      className={addClass ? `${styles.Button} ${addClass}` : styles.Button}
    >
      {children}
    </button>
  );
}

export default Button
