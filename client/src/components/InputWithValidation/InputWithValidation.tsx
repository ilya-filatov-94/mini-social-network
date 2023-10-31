import {
  FC,
  useState,
  useRef,
  useEffect,
  DetailedHTMLProps,
  InputHTMLAttributes
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
  isValidInputs: IStatusValidData;
  setValidInput: (value: IStatusValidData) => void;
  funValidation: TfunValidation;
  validations: IValidations;
}

const InputWithValidation: FC<ISpreadingInputProps> = ({
  idInput,
  classes, 
  value,
  isValidInputs,  
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
      setValidInput({...isValidInputs, [inputName]: isValid});
    }
    if (value && isValid && !isValidInputs[inputName] && funValidation.customFun) {
      setError(funValidation.customFun());
      setValidInput({...isValidInputs, [inputName]: !funValidation.customFun()});
    }
  // eslint-disable-next-line
  }, [isValid, value, isValidInputs[inputName]]);

  function handleFocus() {
    if (!isValid) {
      setError(errorMessage);
      setValidInput({...isValidInputs, [inputName]: isValid});
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
