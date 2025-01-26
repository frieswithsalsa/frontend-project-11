import * as yup from 'yup';
import onChange from 'on-change';
import i18next from 'i18next';

export default () => {
  const state = {
    url: [],
    isValid: true,
    error: '',
  };

  i18next.init({
    lng: 'ru',
    debug: true,
    resources: {
      ru: {
        translation: {
          success: 'RSS успешно загружен',
          invalidUrl: 'Ссылка должна быть валидным URL',
          existingUrl: 'RSS уже существует',
          required: 'Не должно быть пустым',
        },
      },
    },
  });

  yup.setLocale({
    mixed: {
      notOneOf: 'existingUrl',
      required: 'required',
    },
    string: {
      url: 'invalidUrl',
    },
  });

  const form = document.querySelector('.rss-form');
  const input = document.querySelector('#url-input');
  const feedback = document.querySelector('.feedback');

  const watchedState = onChange(state, () => {
    if (watchedState.isValid) {
      feedback.textContent = i18next.t('success');
      feedback.classList.replace('text-danger', 'text-success');
      input.classList.remove('is-invalid');
      input.focus();
      input.value = '';
    } else {
      feedback.textContent = watchedState.error;
      feedback.classList.replace('text-success', 'text-danger');
      input.classList.add('is-invalid');
    }
  });

  const schema = (urls) => yup.string().required()
    .url()
    .notOneOf(urls);

  form.addEventListener('submit', async (event) => {
    event.preventDefault();
    const formData = new FormData(form);
    const url = formData.get('url');
    try {
      await schema(watchedState.url).validate(url);
      watchedState.isValid = true;
      watchedState.url.push(url);
    } catch (error) {
      watchedState.isValid = false;
      watchedState.error = i18next.t(error.message);
    }
  });
};