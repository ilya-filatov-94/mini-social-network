import {
  FC,
  useState,
  useRef,
  useEffect,
  DetailedHTMLProps,
  InputHTMLAttributes,
  SetStateAction
} from 'react';
import styles from './InputWithValidation.module.scss';
import {useValidation, IValidations, TFnOfValidation} from '../../hooks/useValidation';


type TfunValidation = {
  customFun: TFnOfValidation;
}

interface IStatusValidData {
  [key: string]: boolean;
}

interface ISpreadingInputProps
  extends DetailedHTMLProps<InputHTMLAttributes<HTMLInputElement>, HTMLInputElement> {
  idInput?: number;
  classes?: string;
  value: string;
  isValidInput: boolean;
  setValidInput: (value: SetStateAction<IStatusValidData>) => void;
  funValidation: TfunValidation;
  validations: IValidations;
}

const InputWithValidation: FC<ISpreadingInputProps> = ({
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
}


export default InputWithValidation;
