import icons from '../../img/icons.svg';
import View from './view.js';

class PaginationView extends View {
  _parentEl = document.querySelector('.pagination');

  addHandlerClick(handler) {
    this._parentEl.addEventListener('click', e => {
      const btn = e.target.closest('.btn--inline');
      if (!btn) return;
      const goTo = Number(btn.dataset.goto);
      handler(goTo);
    });
  }
  _generateMarkup(data) {
    const numPages = Math.ceil(data.results.length / data.resultsPerPage);

    if (data.page === 1 && data.page < numPages) {
      return `
        <span class="pages__number">${numPages} Pages</span>
        <button data-goto="${
          data.page + 1
        }" class="btn--inline pagination__btn--next">
            <span>Page ${data.page + 1}</span>
            <svg class="search__icon">
                <use href="${icons}#icon-arrow-right"></use>
            </svg>
        </button>
        `;
    }
    if (data.page === numPages && numPages > 1) {
      return `
        <button data-goto="${
          data.page - 1
        }" class="btn--inline pagination__btn--prev">
            <svg class="search__icon">
                <use href="${icons}#icon-arrow-left"></use>
            </svg>
            <span>Page ${data.page - 1}</span>
        </button>
        <span class="pages__number">${numPages} Pages</span>
        `;
    }
    if (data.page > 1) {
      return `
        <button data-goto="${
          data.page - 1
        }" class="btn--inline pagination__btn--prev">
            <svg class="search__icon">
                <use href="${icons}#icon-arrow-left"></use>
            </svg>
            <span>Page ${data.page - 1}</span>
        </button>
        <span class="pages__number">${numPages} Pages</span>
        <button data-goto="${
          data.page + 1
        }" class="btn--inline pagination__btn--next">
            <span>Page ${data.page + 1}</span>
            <svg class="search__icon">
                <use href="${icons}#icon-arrow-right"></use>
            </svg>
        </button>
        `;
    }
    return '';
  }
}

export default new PaginationView();
