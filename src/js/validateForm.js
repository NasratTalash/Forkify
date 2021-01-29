const title = document.querySelector('#rTitle');
const url = document.querySelector('#rUrl');
const imgUrl = document.querySelector('#rImgUrl');
const publisher = document.querySelector('#rPublisher');
const prepTime = document.querySelector('#rPrepTime');
const servings = document.querySelector('#rServings');

let messages = {
  emptyField: `Input field can't be empty!`,
  text: `Can't contain numbers and symbols!`,
  url: `Invalid URL!`,
  number: `Input should be a number!`,
};
let regexes = {
  text: /^[A-Za-z \.-]+$/i,
  url: /(https?:\/\/(?:www\.|(?!www))[a-zA-Z0-9][a-zA-Z0-9-]+[a-zA-Z0-9]\.[^\s]{2,}|www\.[a-zA-Z0-9][a-zA-Z0-9-]+[a-zA-Z0-9]\.[^\s]{2,}|https?:\/\/(?:www\.|(?!www))[a-zA-Z0-9]+\.[^\s]{2,}|www\.[a-zA-Z0-9]+\.[^\s]{2,})/i,
  number: /^\d+$/,
};

function validate(element, regex, message) {
  let passValidation = false;
  if (element.value === '') {
    element.classList.add('error');
    element.nextElementSibling.textContent = messages.emptyField;
    element.nextElementSibling.classList.add('errorVisible');
  } else {
    if (!regex.test(element.value)) {
      element.classList.add('error');
      element.nextElementSibling.textContent = message;
      element.nextElementSibling.classList.add('errorVisible');
    } else {
      element.classList.remove('error');
      element.nextElementSibling.classList.remove('errorVisible');
      passValidation = true;
    }
  }
  return passValidation;
}

function validateIngredient(ingredientInputs, regex, message) {
  let passValidation = false;
  if (ingredientInputs[0].value === '') {
    ingredientInputs[0].classList.add('error');
    ingredientInputs[0].nextElementSibling.textContent = messages.emptyField;
    ingredientInputs[0].nextElementSibling.classList.add('errorVisible');
  } else {
    if (!regex.test(ingredientInputs[0].value)) {
      ingredientInputs[0].classList.add('error');
      ingredientInputs[0].nextElementSibling.textContent = message;
      ingredientInputs[0].nextElementSibling.classList.add('errorVisible');
    } else {
      ingredientInputs[0].classList.remove('error');
      ingredientInputs[0].nextElementSibling.classList.remove('errorVisible');
      passValidation = true;
    }
  }
  return passValidation;
}

function validateAllIngredients() {
  const numberOfIngredients =
    document.querySelectorAll(`[id^="ing"]`).length / 3;
  // An array of of arrays, each containing single ingredient's input fields
  const ingredients = [];
  for (let i = 1; i <= numberOfIngredients; i++) {
    ingredients.push(Array.from(document.querySelectorAll(`[id^="ing${i}"]`)));
  }

  return ingredients.map(ingredient =>
    validateIngredient(ingredient, regexes.text, messages.text)
  );
}

export function validateForm() {
  const resultArr = [
    validate(title, regexes.text, messages.text),
    validate(url, regexes.url, messages.url),
    validate(imgUrl, regexes.url, messages.url),
    validate(publisher, regexes.text, messages.text),
    validate(prepTime, regexes.number, messages.number),
    validate(servings, regexes.number, messages.number),
    ...validateAllIngredients(),
  ];
  return resultArr.every(el => el === true);
}
