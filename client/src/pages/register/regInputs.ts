
export const inputs = [
    {
        idInput: 1,
        name: "name",
        type: "text",
        placeholder: "Имя",
        required: true,
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
        required: true,
        validations: {
            onlyLetters: true,
            minLength: 3,
            maxLength: 16
        }
    },
    {
        idInput: 3,
        name: "email",
        type: "text",
        placeholder: "Электронная почта",
        required: true,
        validations: {checkEmail: true}
    },
    {
        idInput: 4,
        name: "password",
        type: "password",
        placeholder: "Пароль",
        required: true,
        autoComplete: "false",
        validations: {
            lettersDfferentRegisters: true,
            hasDigit: true,
            minLength: 6,
            maxLength: 32,
        }
    }
];