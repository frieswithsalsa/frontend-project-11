import 'bootstrap/dist/css/bootstrap.min.css';

document.getElementById('rss-form').addEventListener('submit', (event) => {
    event.preventDefault();
    const input = document.getElementById('rss-input');
    console.log(`Adding RSS feed: ${input.value}`);
    input.value = '';
});