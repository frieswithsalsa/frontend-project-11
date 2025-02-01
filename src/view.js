import onChange from 'on-change';
import { Modal } from 'bootstrap';

export const initView = (state, i18next) => {
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
    if (!post.title || !post.description || !post.link) {
      return;
    }

    modalTitle.textContent = post.title;
    modalBody.innerHTML = post.description;
    fullArticleLink.href = post.link;
    modal.show();
  };

  const renderFeeds = () => {
    feedsContainer.innerHTML = `
      <h4 class="${state.feeds.length === 0 ? 'd-none' : ''} mb-4">Фиды</h4>
      ${state.feeds.map((feed) => `
        <div class="feed mb-4">
          <h6>${feed.title}</h6>
          <p>${feed.description}</p>
        </div>
      `).join('')}
    `;
  };

  const renderPosts = () => {
    postsContainer.innerHTML = `
      <h4 class="${state.posts.length === 0 ? 'd-none' : ''} mb-4">Посты</h4>
      ${state.posts.map((post) => `
        <div class="post mb-3 d-flex justify-content-between align-items-center">
          <a href="${post.link}" target="_blank" class="post-link ${state.readPostIds.includes(post.id) ? 'text-secondary fw-normal' : 'fw-bold'}" data-post-id="${post.id}">
            ${post.title}
          </a>
          <button class="btn btn-outline-primary btn-sm" data-post-id="${post.id}">Просмотр</button>
        </div>
      `).join('')}
    `;

    document.querySelectorAll('.post-link').forEach((link) => {
      link.addEventListener('click', (e) => {
        const postId = e.target.dataset.postId;
        if (postId && !state.readPostIds.includes(postId)) {
          state.readPostIds.push(postId);
          e.target.classList.add('text-muted', 'fw-normal');
          e.target.classList.remove('fw-bold')
        }
      });
    });

    document.querySelectorAll('.btn-outline-primary').forEach((button) => {
      button.addEventListener('click', (e) => {
        e.preventDefault();
        const postId = e.target.dataset.postId;
        const post = state.posts.find((p) => p.id === postId);
        if (post) {
          handlePostClick(post);
          if (!state.readPostIds.includes(postId)) {
            state.readPostIds.push(postId);
            const postLink = document.querySelector(`.post-link[data-post-id="${postId}"]`)
            if (postLink) {
              postLink.classList.add('text-muted', 'fw-normal');
              postLink.classList.remove('fw-bold')
            }
          }
        }
      });
    });
  };

  return onChange(state, (path) => {
    if (path === 'isValid' || path === 'error' | path === "successMessage") {
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