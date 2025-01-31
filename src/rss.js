import axios from "axios";
import { get } from "lodash";

const fetchRss = async (url) => {
    const proxyUrl = `https://allorigins.hexlet.app/get?url=${encodeURIComponent('url')}`;

    const response = await axios get(proxyUrl);

    return response.data.contents;
}