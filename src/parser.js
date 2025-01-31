export const parseRSS = (xmlString) => {
  const parser = new DOMParser();
  const doc = parser.parseFromString(xmlString, 'application/xml');

  const errorNode = doc.querySelector('parsererror');
  if (errorNode) {
    throw new Error('Ресурс не содержит валидный RSS');
  }

  const feedTitle = doc.querySelector('channel > title');
  const feedDescription = doc.querySelector('channel > description');

  if (!feedTitle || !feedDescription) {
    throw new Error('Ресурс не содержит валидный RSS');
  }

  const items = doc.querySelectorAll('item');
  const posts = Array.from(items).map((item) => {
    const title = item.querySelector('title');
    const link = item.querySelector('link');

    if (!title || !link) {
      throw new Error('Ресурс не содержит валидный RSS');
    }

    return {
      title: title.textContent,
      link: link.textContent,
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