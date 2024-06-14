
export const inputs = [
    {
        idInput: 1,
        name: "name",
        type: "text",
        placeholder: "Имя",
        label: "Имя",
        required: false,
        validations: {
            onlyLetters: true,
            minLength: 3,
            maxLength: 16,
        }
    },
    {
        idInput: 2,
        name: "lastname",
        type: "text",
        placeholder: "Фамилия",
        label: "Фамилия",
        required: false,
        validations: {
            onlyLetters: true,
            minLength: 3,
            maxLength: 16
        }
    },
    {
        idInput: 3,
        name: "city",
        type: "text",
        placeholder: "Город",
        label: "Город",
        required: false,
        validations: {}
    },
    {
        idInput: 4,
        name: "website",
        type: "text",
        placeholder: "Ссылка на другие соц. сети",
        label: "Ссылка на другие соц. сети",
        required: false,
        validations: {}
    },
    {
        idInput: 5,
        name: "email",
        type: "text",
        placeholder: "Новая электронная почта",
        label: "Электронная почта",
        required: false,
        validations: {checkEmail: true}
    },
    {
        idInput: 6,
        name: "password",
        type: "password",
        placeholder: "Новый пароль",
        label: "Пароль",
        required: false,
        autoComplete: "false",
        validations: {
            lettersDfferentRegisters: true,
            hasDigit: true,
            minLength: 6,
            maxLength: 32,
        }
    }
];

export type TValidation = Record<string,  number | boolean | undefined>;

export const getErrorMessage = (value: string, validations: TValidation) => {
    for (const validation in validations) {
        switch (validation) {    
            case 'firstCharacterIsLetter':
                if (value !=='' && !/^[A-Za-z]/.test(value)) {
                    return 'может начинаться только с латинской буквы';
                }
                break;

            case 'only_LatinLetter_Digits_Underscore':
                if (value !=='' &&  !/^[A-Za-z0-9_]*$/.test(value)) {
                    return 'допускает только латинские символы, символ _  и цифры';
                }
                break;

            case 'onlyLetters':
                if (value !=='' &&  !/^[A-ZА-ЯЁa-zа-яё]*$/.test(value)) {
                    return 'только латинские символы или кириллица';
                }
                break;
            
            case 'minLength':
                let minLimit = validations[validation];
                if (typeof minLimit === 'number') {
                    if (value.length < minLimit) {
                        return `не может быть короче ${validations[validation]} символов`;
                    }
                }
                break;

            case 'maxLength':
                let maxLimit = validations[validation];
                if (typeof maxLimit === 'number') {
                    if (value.length > maxLimit) {
                        return `не может быть длинее ${validations[validation]} символов`;
                    }
                }
                break;

            case 'checkEmail': 
                const isEmail = /^([a-z][a-z0-9]{1,13}[_.\\-]?[a-z0-9]{1,13})@(((25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?))|([a-z0-9]{1,10}[\\-]?[a-z0-9]{1,10}[.]?[a-z0-9-]{1,10}[.]{1}[a-z]{2,4}))$/;
                if (!isEmail.test(value)) {
                    return 'некоррекный адрес эл. почты';
                }
                break;

            case 'hasDigit':
                const hasDigit = /[0-9]/g.test(value);
                if (!hasDigit) {
                    return 'требуется наличие цифр';
                }
                break;

            case 'lettersDfferentRegisters':
                const hasLettersBigRegister = /[A-ZА-ЯЁ]/g.test(value);
                const hasLettersSmallRegister = /[a-zа-яё]/g.test(value);
                if ((!hasLettersBigRegister || !hasLettersSmallRegister)) {
                    return 'требуется наличие букв разного регистра';
                }
                break;
        }
    }
}
