import onChange from "on-change";
import { Modal } from 'bootstrap';

export const initView = (state, i18next) => {
    const input = document.querySelector('#url-input');
    const feedback = document.querySelector('.feedback');
    const feedsContainer = document.querySelector('.feeds');
    const postsContainer = document.querySelector('.posts');

    const modalTitle = document.querySelector('.modal-title');
    const modalBody = document.querySelector('.modal-body');
    const fullArticleLink = document.querySelector('.full-article');
    const modalElement = document.getElementById('modal')
    const modal = new Modal(modalElement);

    const handleClick = (post) => {
        modalTitle.textContent = post.title;
        modalBody.textContent = post.description;
        fullArticleLink.href = post.link;
        modal.show();
    };

    const renderFeeds = () => {
        feedsContainer.innerHTML = state.feeds.map((feed) => `
            <div class="feed mb-4">
                <h3>${feed.title}</h3>
                <p>${feed.description}</p>
            </div>
        `).join('');
    };

    const renderPosts = () => {
        postsContainer.innerHTML = state.posts.map((post) => `
            <div class="post mb-3">
                <a href="${post.link}" target="_blank" class="post-link" data-post-id="${post.id}">${post.title}</a>
            </div>
        `).join('');

        document.querySelectorAll('.post-link').forEach((link) => {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                const postId = e.target.dataset.postId;
                const post = state.posts.find((p) => p.id === postId);
                if (post) {
                    handleClick(post);
                }
            });
        });
    };

    return onChange(state, (path) => {
        if (path === 'isValid' || path === 'error') {
            if (state.isValid) {
                feedback.textContent = i18next.t('success');
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

        if (path === 'posts') {
            renderPosts();
        }
    });
};
