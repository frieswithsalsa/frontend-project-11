import onChange from 'on-change';
import { Modal } from 'bootstrap';

export default (state, i18next) => {
  const input = document.querySelector('#url-input');
  const feedback = document.querySelector('.feedback');
  const feedsContainer = document.querySelector('.feeds');
  const postsContainer = document.querySelector('.posts');

  const modalTitle = document.querySelector('.modal-title');
  const modalBody = document.querySelector('.modal-body');
  const fullArticleLink = document.querySelector('.full-article');
  const modalElement = document.getElementById('modal');
  const modal = new Modal(modalElement);

  const handlePostClick = (post) => {
    const { title, description, link } = post;
    if (!title || !description || !link) {
      return;
    }

    modalTitle.textContent = title;
    modalBody.innerHTML = description;
    fullArticleLink.href = link;
    modal.show();
  };

  const renderFeeds = () => {
    const { feeds } = state;
    feedsContainer.innerHTML = `
      <h4 class="${feeds.length === 0 ? 'd-none' : ''} mb-4">Фиды</h4>
      ${feeds.map(({ title, description }) => `  <!-- Деструктуризация каждого feed -->
        <div class="feed mb-4">
          <h6>${title}</h6>
          <p>${description}</p>
        </div>
      `).join('')}
    `;
  };

  const renderPosts = () => {
    const { posts, readPostIds } = state;
    postsContainer.innerHTML = `
      <h4 class="${posts.length === 0 ? 'd-none' : ''} mb-4">Посты</h4>
      ${posts.map(({ id, title, link }) => `  <!-- Деструктуризация каждого post -->
        <div class="post mb-3 d-flex justify-content-between align-items-center">
          <a href="${link}" target="_blank" class="${readPostIds.includes(id) ? 'text-secondary' : 'fw-bold'}" data-post-id="${id}">
            ${title}
          </a>
          <button class="btn btn-outline-primary btn-sm" data-post-id="${id}">Просмотр</button>
        </div>
      `).join('')}
    `;

    document.querySelectorAll('a').forEach((link) => {
      link.addEventListener('click', (e) => {
        const postId = e.target.dataset.postId;
        if (postId && !readPostIds.includes(postId)) {
          readPostIds.push(postId);
          e.target.classList.remove('fw-bold');
          e.target.classList.add('text-secondary');
        }
      });
    });

    document.querySelectorAll('.btn-outline-primary').forEach((button) => {
      button.addEventListener('click', (e) => {
        e.preventDefault();
        const postId = e.target.dataset.postId;
        const post = posts.find((p) => p.id === postId);
        if (post) {
          handlePostClick(post);
          if (!readPostIds.includes(postId)) {
            readPostIds.push(postId);
            const postLink = document.querySelector(`a[data-post-id="${postId}"]`);
            if (postLink) {
              postLink.classList.remove('fw-bold');
              postLink.classList.add('text-secondary');
            }
          }
        }
      });
    });
  };

  return onChange(state, (path) => {
    if (path === 'isValid' || path === 'error' || path === 'successMessage') {
      if (state.isValid) {
        feedback.textContent = state.successMessage;
        feedback.classList.replace('text-danger', 'text-success');
        input.classList.remove('is-invalid');
        input.value = '';
        input.focus();
      } else {
        feedback.textContent = i18next.t(state.error);
        feedback.classList.replace('text-success', 'text-danger');
        input.classList.add('is-invalid');
      }
    }

    if (path === 'feeds') {
      renderFeeds();
    }

    if (path === 'posts' || path === 'readPostIds') {
      renderPosts();
    }
  });
};
