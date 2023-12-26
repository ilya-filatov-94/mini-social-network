import {
  FC,
  DetailedHTMLProps,
  InputHTMLAttributes,
  memo
} from 'react';
import styles from './Input.module.scss';


interface ISpreadingInputProps
  extends DetailedHTMLProps<InputHTMLAttributes<HTMLInputElement>, HTMLInputElement> {
  addClass?: string;
}

const Input: FC<ISpreadingInputProps> = memo(({
  addClass,
  ...props
}) => {
  return (
    <input
      {...props}
      className={addClass ? `${styles.Input} ${addClass}`: styles.Input}
    />
  );
});

export default Input;
