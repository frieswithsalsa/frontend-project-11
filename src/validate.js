import * as yup from yup;

const schema = yup.object().shape({
    adress: yup.string()
        .url('Введите правильный URL')
        .required('Адресс обязателен')
});

const validateAdress = async (adress) => {
    try {
        await schema.validate({ adress });
        console.log('Адресс валиден')
    } catch (error) {
        console.log(error.erros)
    }
}