import * as yup from 'yup';
import 'bootstrap';

const validate = (url, urlList) => {
    const schema = string()
        .url('Ссылка должна быть валидным URL')
        .notOneOf(urlList, 'RSS уже существует')
        .required('URL обязателен');

    return schema
        .validate(url)
        .then(() => null)
        .catch((error) => error.message);
};
