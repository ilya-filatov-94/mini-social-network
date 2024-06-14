/* eslint-disable default-case */
import { useEffect, useState } from "react";

export type TFnOfValidation = (() => string) | undefined;

export type TValidations = Record<string, number | boolean | TFnOfValidation>;

export const useValidation = (value: string, validations: TValidations) => {

    const [isValid, setValid] = useState(true);
    const [errorMessage, setErrorMessage] = useState('');

    useEffect(() => {
        setValid(true);
        setErrorMessage('');
        for (const validation in validations) {
            switch (validation) {    
                case 'firstCharacterIsLetter':
                    if (value !=='' && !/^[A-Za-z]/.test(value)) {
                        setValid(false);
                        setErrorMessage(`может начинаться только с латинской буквы`);
                    }
                    break;

                case 'only_LatinLetter_Digits_Underscore':
                    if (value !=='' &&  !/^[A-Za-z0-9_]*$/.test(value)) {
                        setValid(false);
                        setErrorMessage(`допускает только латинские символы, символ _  и цифры`);
                    }
                    break;

                case 'onlyLetters':
                    if (value !=='' &&  !/^[A-ZА-ЯЁa-zа-яё]*$/.test(value)) {
                        setValid(false);
                        setErrorMessage(`только латинские символы или кириллица`);
                    }
                    break;
                
                case 'minLength':
                    let minLimit = validations[validation];
                    if (typeof minLimit === 'number') {
                        if (value.length < minLimit) {
                            setValid(false);
                            setErrorMessage(`не может быть короче ${validations[validation]} символов`);
                        }
                    }
                    break;

                case 'maxLength':
                    let maxLimit = validations[validation];
                    if (typeof maxLimit === 'number') {
                        if (value.length > maxLimit) {
                            setValid(false);
                            setErrorMessage(`не может быть длинее ${validations[validation]} символов`);
                        }
                    }
                    break;

                case 'checkEmail': 
                    const isEmail = /^([a-z][a-z0-9]{1,13}[_.\\-]?[a-z0-9]{1,13})@(((25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?))|([a-z0-9]{1,10}[\\-]?[a-z0-9]{1,10}[.]?[a-z0-9-]{1,10}[.]{1}[a-z]{2,4}))$/;
                    if (!isEmail.test(value)) {
                        setValid(false);
                        setErrorMessage(`некоррекный адрес эл. почты`);
                    }
                    break;

                case 'hasDigit':
                    const hasDigit = /[0-9]/g.test(value);
                    if (!hasDigit) {
                        setValid(false);
                        setErrorMessage('требуется наличие цифр');
                    }
                    break;

                case 'lettersDfferentRegisters':
                    const hasLettersBigRegister = /[A-ZА-ЯЁ]/g.test(value);
                    const hasLettersSmallRegister = /[a-zа-яё]/g.test(value);
                    if ((!hasLettersBigRegister || !hasLettersSmallRegister)) {
                        setValid(false);
                        setErrorMessage('требуется наличие букв разного регистра');
                    }
                    break;

                case 'customFun':
                    const resultFun = validations[validation] as TFnOfValidation;
                    if (resultFun) {
                        setValid(!resultFun());
                        setErrorMessage(resultFun());
                    }
                    break;
            }
        }
    // eslint-disable-next-line
    }, [value]);
    return {isValid, errorMessage}
}
