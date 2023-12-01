import {
  FC,
  HTMLAttributes,
  ReactNode,
  memo
} from 'react';
import styles from './Button.module.scss';


interface ISpreadingButtonProps
  extends HTMLAttributes<HTMLButtonElement> {
  addClass?: string;
  children: ReactNode;
}


const Button: FC<ISpreadingButtonProps> = memo(({ 
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
});

export default Button
