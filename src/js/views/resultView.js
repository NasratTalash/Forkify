import icons from '../../img/icons.svg';
import View from './view.js';

class ResultView extends View {
  _parentEl = document.querySelector('.results');
  _errorMessage = 'No recipes found for your search, please try again ;)';
  _generateMarkup(results) {
    const id = window.location.hash.slice(1);

    const markup = results
      .map(result => {
        return `
          <li class="preview">
            <a class="preview__link ${
              result.id === id ? 'preview__link--active' : ''
            }" href="#${result.id}">
              <figure class="preview__fig">
                <img src="${result.image}" alt="${result.title}" />
              </figure>
              <div class="preview__data">
                <h4 class="preview__title">${result.title}</h4>
                <p class="preview__publisher">${result.publisher}</p>
                <div class="preview__user-generated ${
                  !result.key ? 'hidden' : ''
                }">
                  <svg>
                    <use href="${icons}#icon-user"></use>
                  </svg>
                </div>
              </div>
              
              </a>
          </li>
          `;
      })
      .join('');
    return markup;
  }
}

export default new ResultView();
