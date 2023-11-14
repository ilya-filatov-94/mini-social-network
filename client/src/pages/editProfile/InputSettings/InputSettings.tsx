import {
    FC, 
    useRef, 
    MutableRefObject, 
    useState, 
    DetailedHTMLProps, 
    InputHTMLAttributes,
    useEffect,
    memo
} from 'react';
import styles from './InputSettings.module.scss';
import {getErrorMessage, IValidations} from '../editUserInputs';

interface IError {
  [key: string]: string;
}

interface ISpreadingInputProps
  extends DetailedHTMLProps<InputHTMLAttributes<HTMLInputElement>, 
  HTMLInputElement> {
  idInput: number;
  label: string;
  defaultValue: string | number | undefined;
  isError: IError;
  validations: IValidations;
  setValueinForm: (ref: MutableRefObject<null | HTMLInputElement>, error: string) => void;
  classes?: string;
}

const InputSettings: FC<ISpreadingInputProps> = memo(({
    idInput,
    label, 
    defaultValue, 
    isError,
    validations,
    setValueinForm,
    classes,
    ...props
}) => {
  const refInut = useRef<HTMLInputElement>(null);
  const [errorMessage, setError] = useState<string>('');

  function checkValue() {
    if (refInut.current) {
      let error;
      if (validations) {
        error = getErrorMessage(refInut.current.value, validations) || '';
      }
      setError(error || '');
      setValueinForm(refInut, error || '');
    }
  }

  function checkError() {
    if (refInut.current && validations) {
      const error = getErrorMessage(refInut.current.value, validations) || '';
      if (!error) {
        setError(error);
        setValueinForm(refInut, error || '');
      }
    }
  }

  useEffect(() => {
    if (refInut.current) {
      if (refInut.current.name !== "password") {
        refInut.current.value = String(defaultValue);
      }
    }
  }, [defaultValue]);

  useEffect(() => {
    if (refInut.current) {
      if (refInut.current.name === isError.name 
        && isError.message) {
        setError(isError.message || errorMessage);
      }
    }
  // eslint-disable-next-line
  }, [isError.name]);

  return (
    <div>
      <label className={styles.label}>
        {label}
        <input
            className={`${styles.input} ${errorMessage ? styles.invalidData : ''} 
            ${classes ? classes : ''}`}
            ref={refInut}
            onBlur={checkValue}
            onChange={checkError}
            {...props}
        />
        <div className={styles.error}>
          <span>{errorMessage}</span>
        </div>
      </label>
    </div>
  )
});

export default InputSettings;
