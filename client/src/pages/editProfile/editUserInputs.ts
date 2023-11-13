
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
        name: "city",
        type: "text",
        placeholder: "Город",
        required: true,
        validations: {
            onlyLetters: true,
            minLength: 3,
            maxLength: 16,
        }
    },
    {
        idInput: 4,
        name: "website",
        type: "text",
        placeholder: "Ссылка на другие соц. сети",
        required: true,
        validations: {
            onlyLetters: true,
            minLength: 3,
            maxLength: 16,
        }
    },
    {
        idInput: 5,
        name: "email",
        type: "text",
        placeholder: "Новая электронная почта",
        required: true,
        validations: {checkEmail: true}
    },
    {
        idInput: 6,
        name: "password",
        type: "password",
        placeholder: "Новый пароль",
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