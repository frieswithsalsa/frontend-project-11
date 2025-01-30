import * as yup from 'yup';

export const createSchema = (urls) => yup.string()
    .required('required')
    .url('invalidUrl')
    .notOneOf(urls, 'existingUrl');

export const validateUrl = async (url, schema) => {
    try {
        await schema.validate(url);
        return { isValid: true, error: '' };
    } catch (error) {
        return { isValid: false, error: error.message };
    }
};