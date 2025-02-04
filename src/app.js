/* eslint-disable no-useless-catch */
import i18next from 'i18next';
import initView from './view.js';
import { createSchema } from './validate.js';
import fetchRss from './rss.js';
import parseRSS from './parser.js';
import checkForUpdates from './updater.js';

const loadRssFeed = async (url, watchedState) => {
  try {
    const rssData = await fetchRss(url);
    const { feed, posts } = parseRSS(rssData);

    const newState = {
      ...watchedState,
      feeds: [...watchedState.feeds, feed],
      posts: [
        ...watchedState.posts,
        ...posts.map((post, index) => ({
          ...post,
          id: `post-${index}`,
        })),
      ],
      urls: [...watchedState.urls, url],
      isValid: true,
      error: '',
      successMessage: i18next.t('success'),
    };

    return newState;
  } catch (err) {
    const newState = {
      ...watchedState,
      isValid: false,
      successMessage: '',
    };

    if (err instanceof TypeError && err.message === 'networkError') {
      newState.error = i18next.t('networkError');
    } else {
      newState.error = i18next.t('invalidRSS');
    }

    throw err;
  }
};

export default () => {
  const state = {
    urls: [],
    isValid: true,
    error: '',
    feeds: [],
    posts: [],
    readPostIds: [],
    loading: false,
    successMessage: '',
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

      const newState = await loadRssFeed(url, watchedState);

      if (newState.urls.length === 1) {
        setTimeout(() => {
          checkForUpdates(newState);
        }, 1000);
      }
      
      Object.assign(watchedState, newState);
    } catch (err) {
      if (err.name === 'ValidationError') {
        watchedState.error = err.message;
      } else {
        watchedState.error = i18next.t(err.message);
      }
      watchedState.isValid = false;
      watchedState.successMessage = '';
    } finally {
      watchedState.loading = false;
    }
  });
};
