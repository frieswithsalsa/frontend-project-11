import onChange from "on-change";

export const initView = (state, i18next) => {
    const input = document.querySelector('#url-input');
    const feedback = document.querySelector('.feedback');

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
    });
};