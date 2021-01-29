import 'core-js/stable';
import 'regenerator-runtime/runtime';
import * as model from './model.js';
import recipeView from './views/recipeView.js';
import searchView from './views/searchView.js';
import resultView from './views/resultView.js';
import paginationView from './views/paginationView.js';
import bookmarksView from './views/bookmarksView.js';
import addRecipeView from './views/addRecipeView.js';
import { validateForm } from './validateForm.js';
const timeout = function (s) {
  return new Promise(function (_, reject) {
    setTimeout(function () {
      reject(new Error(`Request took too long! Timeout after ${s} second`));
    }, s * 1000);
  });
};

async function controlRecipe() {
  const id = window.location.hash.slice(1);
  if (!id) return;
  try {
    recipeView.renderSpinner();
    await model.loadRecipe(id);
    recipeView.render(model.state.recipe);
    resultView.updateUI(model.getResultsForPage());
    bookmarksView.updateUI(model.state.bookmarks);
  } catch (err) {
    console.error(err.message);
    recipeView.renderError();
  }
}

async function controlSearch() {
  try {
    const query = searchView.getQuery();
    if (!query) return;

    resultView.renderSpinner();
    await model.loadSearchResult(query);
    if (model.state.search.results.length === 0) {
      resultView.renderError();
      return;
    }
    resultView.render(model.getResultsForPage());
    paginationView.render(model.state.search);
  } catch (error) {
    console.log(error);
    resultView.renderError(error.message);
  }
}

function controlPagination(goTo) {
  resultView.render(model.getResultsForPage(goTo));
  paginationView.render(model.state.search);
}

function controlServings(updateServingsTo) {
  model.updateServings(updateServingsTo);
  // recipeView.render(model.state.recipe);
  recipeView.updateUI(model.state.recipe);
}

function controlBookmark() {
  if (!model.state.recipe.bookmarked) model.addBookmark(model.state.recipe);
  else model.removeBookmark(model.state.recipe);
  recipeView.updateUI(model.state.recipe);
  bookmarksView.render(model.state.bookmarks);
  bookmarksView.updateUI(model.state.bookmarks);
}
function renderBookmarks() {
  let storedBookmarks = localStorage.getItem('bookmarks');
  if (!storedBookmarks) return;
  storedBookmarks = JSON.parse(storedBookmarks);
  model.state.bookmarks = storedBookmarks;
  bookmarksView.render(storedBookmarks);
  // bookmarksView.updateUI(model.state.bookmarks);
}

async function controlAddRecipe(data) {
  try {
    const res = validateForm();
    if (!res) return;
    await model.uploadNewRecipe(data);
    recipeView.render(model.state.recipe);
    bookmarksView.render(model.state.bookmarks);
    window.history.pushState(null, '', `#${model.state.recipe.id}`);
    console.log(model.state.recipe);
  } catch (error) {
    addRecipeView.renderError(error.message);
  }
}

function controlAddIngredient() {
  addRecipeView.renderNewIngredient();
}
// IIFE for event handlers to implement publisher-subscriber pattern
(function () {
  recipeView.addHandlerRender(controlRecipe);
  recipeView.addHandlerUpdateServings(controlServings);
  recipeView.addHandlerBookmark(controlBookmark);
  searchView.addHandlerSearch(controlSearch);
  paginationView.addHandlerClick(controlPagination);
  bookmarksView.addHandlerRender(renderBookmarks);
  addRecipeView.addHandlerUpload(controlAddRecipe);
  addRecipeView.addHandlerAddIngredient(controlAddIngredient);
})();
