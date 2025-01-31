import { fetchRss } from "./rss.js";
import { parseRSS } from "./parser.js"

export const checkForUpdates = async (state) => {
    try {
        for (const url of state.urls) {
            const rssData = await fetchRss(url);
            const { posts: newPosts } = parseRSS(rssData)
            
            const existingUrl = state.posts.map((post) => post.link);
            const uniqueNewPosts = newPosts.filter(
                (post) => !existingUrl.includes(post.link)
            );

            if (uniqueNewPosts.length > 0) {
                state.posts.unshift(...uniqueNewPosts);
            }
        }
    } catch (err) {
        console.log('Error', err);
    } finally {
        setTimeout(() => checkForUpdates(state), 5000)
    }
}