import { ReactElement, DetailedHTMLProps, InputHTMLAttributes } from 'react';
import styles from './Input.module.scss';


interface ISpreadingInputProps
  extends DetailedHTMLProps<InputHTMLAttributes<HTMLInputElement>,HTMLInputElement> {
  addClass?: string;
}

const Input = ({...props}: ISpreadingInputProps): ReactElement => {
  return (
    <input
      {...props}
      className={props.addClass ? `${styles.Input} ${props.addClass}`: styles.Input}
    />
  );
}

export default Input;
