async function fetchRssFedd(url) {
  const proxyUrl = `https://api.allorigins.win/get?url=${encodeURIComponent(
    url
  )}&disableCache=true`;

  const response = await fetch(proxyUrl);

  if (!response.ok) {
    throw new Error(
      `Ошибка загрузки: ${response.status} ${response.statusText}`
    );
  }

  const { contents } = await response.json();
  return contents;
}
