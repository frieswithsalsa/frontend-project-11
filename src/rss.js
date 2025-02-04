import axios from "axios";

export const fetchRss = async (url) => {
    const proxyUrl = `https://allorigins.hexlet.app/get?url=${encodeURIComponent(url)}&disableCache=true`;
  
    try {
      const response = await axios.get(proxyUrl);
      return response.data.contents;
    } catch (err) {
      if (err.response) {
        throw new Error('serverError');
      } else if (err.request) {
        throw new TypeError('networkError');
      } else {
        throw new Error('unexpectedError');
      }
    }
  };
  