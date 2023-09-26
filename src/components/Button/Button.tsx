import { ReactNode, ReactElement, HTMLAttributes } from 'react';
import styles from './Button.module.scss';


interface ISpreadingButtonProps
  extends HTMLAttributes<HTMLButtonElement> {
  addClass?: string;
  children: ReactNode;
}

const Button = ({addClass, children, ...props}: ISpreadingButtonProps): ReactElement => {
  return (
    <button 
      {...props}
      className={addClass ? `${styles.Button} ${addClass}`: styles.Button}
    >
      {children}
    </button>
);
}

export default Button
