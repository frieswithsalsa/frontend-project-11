const parseRSS = (xmlString) => {
  const parser = new DOMParser();
  const doc = parser.parseFromString(xmlString, 'application/xml');

  const errorNode = doc.querySelector('parsererror');
  if (errorNode) {
    throw new Error('invalidRSS');
  }

  const feedTitle = doc.querySelector('channel > title');
  const feedDescription = doc.querySelector('channel > description');

  if (!feedTitle || !feedDescription) {
    throw new Error('invalidRSS');
  }

  const items = doc.querySelectorAll('item');
  const posts = Array.from(items).map((item) => {
    const title = item.querySelector('title');
    const link = item.querySelector('link');
    const description = item.querySelector('description');

    if (!title || !link || !description) {
      throw new Error('invalidRSS');
    }

    return {
      title: title.textContent,
      link: link.textContent,
      description: description.textContent,
    };
  });

  return {
    feed: {
      title: feedTitle.textContent,
      description: feedDescription.textContent,
    },
    posts,
  };
};

export default parseRSS;
