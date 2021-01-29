import View from './view.js';

class BookmarkView extends View {
  _parentEl = document.querySelector('.bookmarks__list');
  _errorMessage = 'No bookmarks yet. find a good recipe and bookmark it ;)';
  addHandlerRender(handler) {
    window.addEventListener('load', handler);
  }
  _generateMarkup(bookmarks) {
    const id = window.location.hash.slice(1);
    if (bookmarks.length === 0) {
      this.renderMessage(this._errorMessage);
      return '';
    }
    const markup = bookmarks
      .map(bookmark => {
        return `
          <li class="preview">
            <a class="preview__link ${
              bookmark.id === id ? 'preview__link--active' : ''
            }" href="#${bookmark.id}">
              <figure class="preview__fig">
                <img src="${bookmark.image}" alt="${bookmark.title}" />
              </figure>
              <div class="preview__data">
                <h4 class="preview__title">${bookmark.title}</h4>
                <p class="preview__publisher">${bookmark.publisher}</p>
              </div>
            </a>
          </li>
          `;
      })
      .join('');
    return markup;
  }
}

export default new BookmarkView();
