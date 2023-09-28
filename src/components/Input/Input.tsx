import { ReactElement, DetailedHTMLProps, InputHTMLAttributes } from 'react';
import styles from './Input.module.scss';


interface ISpreadingInputProps
  extends DetailedHTMLProps<InputHTMLAttributes<HTMLInputElement>,HTMLInputElement> {
  addClass?: string;
}

const Input: FC<ISpreadingInputProps> = ({...props}) => {
  return (
    <input
      {...props}
      className={props.addclass ? `${styles.Input} ${props.addclass}`: styles.Input}
    />
  );
}


export default Input;
