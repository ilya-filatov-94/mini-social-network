import {
  FC,
  useState,
  useRef,
  useEffect,
  memo,
  DetailedHTMLProps,
  InputHTMLAttributes,
  SetStateAction
} from 'react';
import styles from './InputWithValidation.module.scss';
import {useValidation, TValidations, TFnOfValidation} from '../../hooks/useValidation';

export type TStatusValidData = Record<string, boolean>;

interface ISpreadingInputProps
  extends DetailedHTMLProps<InputHTMLAttributes<HTMLInputElement>, HTMLInputElement> {
  idInput?: number;
  classes?: string;
  value: string;
  isValidInput: boolean;
  setValidInput: (value: SetStateAction<TStatusValidData>) => void;
  funValidation: Record<'customFun', TFnOfValidation>;
  validations: TValidations;
}

const InputWithValidation: FC<ISpreadingInputProps> = memo(({
  idInput,
  classes, 
  value,
  isValidInput,  
  setValidInput, 
  funValidation,
  validations,
  ...props
}) => {

  const { isValid, errorMessage } = useValidation(value, {...funValidation, ...validations});
  const inputRef = useRef<HTMLInputElement>(null);
  const inputName = inputRef.current ? inputRef.current.name : '';
  const [error, setError] = useState<string>('');


  useEffect(() => {
    if (value && isValid) {
      setError(errorMessage);
      setValidInput(prev => ({...prev, [inputName]: isValid}));
    }
    if (value && isValid && !isValidInput && funValidation.customFun) {
      const errorFromFn = funValidation.customFun();
      setError(errorFromFn);
      setValidInput(prev => ({...prev, [inputName]: !errorFromFn}));
    }
  // eslint-disable-next-line
  }, [isValid, value, isValidInput]);

  function handleFocus() {
    if (!isValid) {
      setError(errorMessage);
      setValidInput(prev => ({...prev, [inputName]: isValid}));
    }
  }

  const rootStyles = [styles.input];
  if (classes) {
    rootStyles.push(classes);
  }
  if (error) {
    rootStyles.push(styles.invalidData);
  }

  return (
    <div className={styles.wrapperInput}>
      <input
        onBlur={handleFocus}
        value={value}
        ref={inputRef}
        className={rootStyles.join(' ')}
        {...props}
      />
      <p className={styles.error}>{error}</p>
    </div>
  );
});


export default InputWithValidation;
