import * as yup from 'yup';


const schema = yup.object().shape({
    input: yup
        .string()
        .required('')
        .url('Ссылка должна быть валидным URL')
})
