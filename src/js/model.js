import { API_URL, TIMEOUT_TIME, API_KEY } from './config.js';
export const state = {
  recipe: {},
  search: {
    query: '',
    results: [],
    page: 1,
    resultsPerPage: 10,
  },
  bookmarks: [],
};

const timeout = function (s) {
  return new Promise(function (_, reject) {
    setTimeout(function () {
      reject(new Error(`Request took too long! Timeout after ${s} second`));
    }, s * 1000);
  });
};
async function AJAX(url, recipeData = '') {
  try {
    let fetchPromise;
    if (recipeData !== '') {
      fetchPromise = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(recipeData),
      });
    } else fetchPromise = await fetch(url);

    const res = await Promise.race([fetchPromise, timeout(TIMEOUT_TIME)]);
    if (!res.ok) throw new Error(`${res.statusText} (${res.status})`);
    let { data } = await res.json();
    return data;
  } catch (error) {
    throw error;
  }
}

function createCustomRecipeObj(recipe) {
  return {
    id: recipe.id,
    image: recipe.image_url,
    cookingTime: recipe.cooking_time,
    source: recipe.source_url,
    title: recipe.title,
    ingredients: recipe.ingredients,
    servings: recipe.servings,
    publisher: recipe.publisher,
  };
}
export async function loadRecipe(id) {
  try {
    let data = await AJAX(`${API_URL}/${id}?key=${API_KEY}`);
    // console.log(data);
    const { recipe } = data;
    state.recipe = createCustomRecipeObj(recipe);
    if (state.bookmarks.some(bookmark => bookmark.id === state.recipe.id)) {
      state.recipe.bookmarked = true;
    } else state.recipe.bookmarked = false;
  } catch (error) {
    throw error;
  }
}

export async function loadSearchResult(query) {
  try {
    state.search.query = query;
    let data = await AJAX(`${API_URL}/?search=${query}&key=${API_KEY}`);
    state.search.results = data.recipes.map(result => {
      return {
        id: result.id,
        image: result.image_url,
        title: result.title,
        publisher: result.publisher,
        ...(result.key && { key: result.key }),
      };
    });
    state.search.page = 1;
  } catch (error) {
    throw error;
  }
}

export function getResultsForPage(page = state.search.page) {
  state.search.page = page;
  const start = (page - 1) * state.search.resultsPerPage;
  const end = page * state.search.resultsPerPage;

  return state.search.results.slice(start, end);
}

export function updateServings(updateTo) {
  state.recipe.ingredients.forEach(ing => {
    ing.quantity = (ing.quantity * updateTo) / state.recipe.servings;
  });
  state.recipe.servings = updateTo;
}

function storeBookmarks(bookmarks) {
  localStorage.setItem('bookmarks', JSON.stringify(bookmarks));
}
export function addBookmark(recipe) {
  state.bookmarks.push(recipe);
  state.recipe.bookmarked = true;
  storeBookmarks(state.bookmarks);
}
export function removeBookmark(id) {
  const index = state.bookmarks.findIndex(bookmark => bookmark.id === id);
  state.recipe.bookmarked = false;
  state.bookmarks.splice(index, 1);
  storeBookmarks(state.bookmarks);
}

function formatRecipeData(recipeData) {
  // Creating object from array of arrays for recipe
  const recipeDataObj = Object.fromEntries(recipeData);
  // Formatting recipe data except for ingredients
  let formatedRecipeData = {
    title: recipeDataObj.title,
    source_url: recipeDataObj.sourceUrl,
    image_url: recipeDataObj.image,
    publisher: recipeDataObj.publisher,
    cooking_time: Number(recipeDataObj.cookingTime),
    servings: Number(recipeDataObj.servings),
    ingredients: [],
  };
  /* Filter the ingredients from the array
   ** For each single ingredient we have 3 array
   ** 1st - including description
   ** 2nd - including unit
   ** 3rd - including quantity
   ** In follwoing form
   ** ["ing1_desc", "Rice"]
   ** ["ing1_unit", "kg"]
   ** ["ing1_qtn", "2.5"]
   */
  const ingredientsData = recipeData.filter(arr => {
    return arr.some(el => el.startsWith('ing'));
  });
  /* Find number of ingredients which is all
   ** arrays having an element which starts
   ** with word "ing" / 3 (each ingredient takes 3 arrays to hold its data)
   */
  const ingLength = ingredientsData.length / 3;
  /*
   ** filtering out each single ingredient and creating
   ** and object for it having description, unit, and quantity properties
   */
  for (let i = 1; i <= ingLength; i++) {
    const singleIng = ingredientsData.filter(arr =>
      arr.some(el => el.startsWith(`ing${i}`))
    );
    const singleIngObj = {
      description: singleIng[0][1], // ingredient description
      unit: singleIng[1][1], // ingredient unit
      quantity: singleIng[2][1], // ingredient quantity
    };
    // pushing single ingredient obj to formated recipe data object
    formatedRecipeData.ingredients.push(singleIngObj);
  }
  return formatedRecipeData;
}

export async function uploadNewRecipe(newRecipe) {
  try {
    const recipeData = formatRecipeData(newRecipe);
    const data = await AJAX(`${API_URL}/?key=${API_KEY}`, recipeData);
    state.recipe = createCustomRecipeObj(data.recipe);
    state.recipe.key = data.recipe.key;
    addBookmark(createCustomRecipeObj(data.recipe));
    return data;
  } catch (error) {
    throw error;
  }
}
