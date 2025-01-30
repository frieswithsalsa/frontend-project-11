import i18next from 'i18next';
import { initView } from './view.js';
import { createSchema } from './validate.js';

export default () => {
  const state = {
    urls: [],
    isValid: true,
    error: '',
  };

  i18next.init({
    lng: 'ru',
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

  const watchedState = initView(state, i18next);


  const form = document.querySelector('.rss-form');
  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const url = formData.get('url').trim();

    const schema = createSchema(watchedState.urls);
    

    try {
      await schema.validate(url);
      watchedState.urls.push(url);
      watchedState.isValid = true;
      watchedState.error = ''; 
    } catch (err) {
      watchedState.error = err.message;
      watchedState.isValid = false;
    }
  });
};