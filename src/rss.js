import axios from "axios";

export const fetchRss = async (url) => {
    const proxyUrl = `https://allorigins.hexlet.app/get?url=${encodeURIComponent(url)}&disableCache=true`;
    const response = await axios.get(proxyUrl);
    return response.data.contents;
};