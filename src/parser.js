export const parseRSS = (xmlString) => {
    const parser = new DOMParser();
    const doc = parser.parseFromString(xmlString, 'application/xml');
  
    const feedTitle = doc.querySelector('title').textContent;
    const feedDescription = doc.querySelector('description').textContent;
  
    const items = doc.querySelectorAll('item');
    const posts = Array.from(items).map((item) => ({
      title: item.querySelector('title').textContent,
      link: item.querySelector('link').textContent,
    }));
  
    return { feed: { title: feedTitle, description: feedDescription }, posts };
  };