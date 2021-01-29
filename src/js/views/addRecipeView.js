import View from './view.js';

class AddRecipeView extends View {
  _parentEl = document.querySelector('.upload');
  _errorMessage = 'No bookmarks yet. find a good recipe and bookmark it ;)';

  constructor() {
    super();
    this._addHandlerShowWindow();
    this._addHandlerHideWindow();
  }
  addHandlerUpload(handler) {
    this._parentEl.addEventListener('submit', e => {
      e.preventDefault();
      let formData = Array.from(new FormData(this._parentEl));
      handler(formData);
    });
  }
  addHandlerAddIngredient(handler) {
    const btn = this._parentEl.querySelector('.btn__add-ingredient');
    btn.addEventListener('click', () => {
      handler();
    });
  }
  renderNewIngredient() {
    const element = this._parentEl.querySelector('.ingredient__column');
    const markup = this._generateInputMarkup();
    element.insertAdjacentHTML('beforeend', markup);
  }
  _generateInputMarkup() {
    const curIngredientsCount = this._parentEl.querySelectorAll(
      '.ingredient__group'
    ).length;
    return `
    <label>Ingredient ${curIngredientsCount + 1}</label>
    <div class="ingredient__group">
      <div class="inputWrapper">
        <input
          type="text"
          name="ing${curIngredientsCount + 1}_desc"
          id="ing${curIngredientsCount + 1}_qtn"
          placeholder="Description"
        />
        <span class="errorMsg">errorMessage</span>
      </div>
      <div class="inputWrapper">
        <input type="text" name="ing${curIngredientsCount + 1}_unit" id="ing${
      curIngredientsCount + 1
    }_unit" placeholder="Unit" />
      <span class="errorMsg">errorMessage</span>
      </div>
      <div class="inputWrapper">
        <input
          type="number"
          name="ing${curIngredientsCount + 1}_qtn"
          id="ing${curIngredientsCount + 1}_qtn"
          placeholder="Quantity"
        />
        <span class="errorMsg">errorMessage</span>
      </div>
    </div>
    `;
  }
  _addHandlerShowWindow() {
    const btnShow = document.querySelector('.nav__btn--add-recipe');
    const modal = document.querySelector('.add-recipe-window');
    const overlay = document.querySelector('.overlay');
    const body = document.body;
    btnShow.addEventListener('click', () => {
      modal.classList.toggle('hidden');
      overlay.classList.toggle('hidden');
      body.classList.add('model-open');
    });
  }
  _addHandlerHideWindow() {
    const btnClose = document.querySelector('.btn--close-modal');
    const modal = document.querySelector('.add-recipe-window');
    const overlay = document.querySelector('.overlay');
    const body = document.body;
    [btnClose, overlay].forEach(el =>
      el.addEventListener('click', () => {
        modal.classList.toggle('hidden');
        overlay.classList.toggle('hidden');
        body.classList.remove('model-open');
      })
    );
  }
}

export default new AddRecipeView();
