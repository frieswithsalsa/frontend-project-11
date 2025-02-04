// updater.js
import fetchRss from './rss.js';
import parseRSS from './parser.js';

const loadAndParseRss = async (url) => {
  const rssData = await fetchRss(url);
  return parseRSS(rssData);
};

const checkForUpdates = async (state) => {
  try {
    await Promise.all(state.urls.map(async (url) => {
      const { posts: newPosts } = await loadAndParseRss(url);

      const existingUrls = state.posts.map((post) => post.link);
      const uniqueNewPosts = newPosts.filter(
        (post) => !existingUrls.includes(post.link)
      );

      if (uniqueNewPosts.length > 0) {
        state.posts.unshift(...uniqueNewPosts);
      }
    }));
  } catch (err) {
    console.log('Error', err);
  } finally {
    setTimeout(() => checkForUpdates(state), 5000);
  }
};

export default checkForUpdates;
