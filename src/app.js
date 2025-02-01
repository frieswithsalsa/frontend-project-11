import i18next from 'i18next';
import { initView } from './view.js';
import { createSchema } from './validate.js';
import { fetchRss } from './rss.js';
import { parseRSS } from './parser.js';
import { checkForUpdates } from './updater.js';

export default () => {
  const state = {
    urls: [],
    isValid: true,
    error: '',
    feeds: [],
    posts: [],
    readPostIds: [],
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
          networkError: 'Ошибка сети',
          invalidRSS: 'Ресурс не содержит валидный RSS',
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
      if (watchedState.urls.includes(url)) {
        throw new Error('existingUrl');
      }

      await schema.validate(url);
      watchedState.loading = true;

      const rssData = await fetchRss(url);

      const { feed, posts } = parseRSS(rssData);

      watchedState.feeds.push(feed);
      watchedState.posts.push(...posts.map((post, index) => ({
        ...post,
        id: `post-${index}`,
      })));
      watchedState.urls.push(url);

      watchedState.isValid = true;
      watchedState.error = '';

      setTimeout(() => {
        if (watchedState.urls.length === 1) {
          checkForUpdates(watchedState);
        }
      }, 1000);
    } catch (err) {
      if (err.name === 'ValidationError') {
        watchedState.error = err.message;
      } else {
        watchedState.error = i18next.t(err.message);
      }
      watchedState.isValid = false;
    } finally {
      watchedState.loading = false;
    }
  });
};