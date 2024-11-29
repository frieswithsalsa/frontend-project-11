import * as yup from yup;

const schema = yup.object.shape({
    input: yup.string().url().required(),
})
