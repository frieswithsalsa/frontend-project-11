import i18next from 'i18next';
import { initView } from './view.js';
import { createSchema } from './validate.js';
import { fetchRss } from './rss.js';
import { parseRSS } from './parser.js';

export default () => {
  const state = {
    urls: [],
    isValid: true,
    error: '',
    feeds: [],
    posts: [],
    loading: false,
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
      watchedState.loading = true;

      const rssData = await fetchRss(url);
      const { feed, posts } = parseRSS(rssData);

      watchedState.feeds.push(feed);
      watchedState.posts.push(...posts);
      watchedState.urls.push(url);

      watchedState.isValid = true;
      watchedState.error = ''; 
    } catch (err) {
      watchedState.error = err.message;
      watchedState.isValid = false;
    } finally {
      watchedState.loading = false;
    }
  });
};