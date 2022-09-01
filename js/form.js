import { clickEvent, EscEvent } from './util.js';
import { sendData } from './api.js';
const form = document.querySelector('.ad-form');
const fieldsetsForm = form.querySelectorAll('fieldset'); //Оболочки для формы
const mapFiltersForm = document.querySelector('.map__filters');
const selectArrOfMap = mapFiltersForm.querySelectorAll('select'); //Коллекция селектов карты(фильтры)
const fieldsetsMap = mapFiltersForm.querySelector('fieldset');
const resetButton = form.querySelector('.ad-form__reset');
const templateSuccessMessage = document.querySelector('#success').content.querySelector('.success');
const templateAlertMessage = document.querySelector('#error').content.querySelector('.error');
const errorButton = templateAlertMessage.querySelector('.error__button');
const submitButton = form.querySelector('.ad-form__submit');
//Функция отключения активного состояния страницы
function createInactiveCondition () {
  form.classList.add('ad-form--disabled');
  fieldsetsForm.forEach((fieldset) => {
    fieldset.setAttribute('disabled', 'disabled');
  });
  mapFiltersForm.classList.add('map__filters--disabled');
  selectArrOfMap.forEach((select) => {
    select.setAttribute('disabled', 'disabled');
  });
  fieldsetsMap.setAttribute('disabled', 'disabled');
}
//Функция включения активного состояния страницы
function createActiveCondition () {
  form.classList.remove('ad-form--disabled');
  fieldsetsForm.forEach((fieldset) => {
    fieldset.removeAttribute('disabled');
  });
  mapFiltersForm.classList.remove('map__filters--disabled');
  selectArrOfMap.forEach((select) => {
    select.removeAttribute('disabled');
  });
  fieldsetsMap.removeAttribute('disabled');
}

//Валидация формы
const pristine = new Pristine(form, {
  classTo: 'ad-form__element',
  errorTextParent: 'ad-form__element',
  errorTextClass: 'error-text'
});

const pristineRoomsGuests = new Pristine (form, {
  classTo: 'ad-form__element',
  errorTextParent: 'ad-form__element',
  errorTextClass: 'error-text'
});

const pristinePlacePrice = new Pristine (form, {
  classTo: 'ad-form__element',
  errorTextParent: 'ad-form__element',
  errorTextClass: 'error-text'
});

//Кастомная валидация кол-ва комнат и гостей
const countRooms = form.querySelector('[name="rooms"]'); // Первый селект
const countGuests = form.querySelector('[name="capacity"]'); // Второй селект
const roomsGuestsOption = {
  '1': ['1'],
  '2': ['2', '1'],
  '3': ['3', '2', '1'],
  '100': ['0']
}; // Условие взаимосвязи селектов (1 комната - 1 гость, 2 комнаты для 2 и для 1 и т.д.)

function validateRoomsGuests () {
  return roomsGuestsOption[countRooms.value].includes(countGuests.value); // Проверяем условие
}

function getRoomsGuestsErrorMessage () {
  switch (countRooms.value) {
    case '1':
      return 'В одну комнату можно заселить только 1 гостя';
    case '2':
      return 'В две комнаты можно заселить до 2 гостей';
    case '3':
      return 'В три комнаты можно заселить до 3 гостей';
    case '100':
      return '100 комнат не для гостей';
  }
}

pristineRoomsGuests.addValidator(countRooms, validateRoomsGuests, getRoomsGuestsErrorMessage);
pristineRoomsGuests.addValidator(countGuests, validateRoomsGuests);

//Кастомная валидация типа жилья и цены за ночь
const typePlace = form.querySelector('#type');//Тип жилья
const price = form.querySelector('#price'); //Цена за ночь
price.setAttribute('min', 1000);//Задаём значение атрибута min по умолчанию для корректной работы pristine

function validatePlacePrice () {
  //Слушатель отражающий зависимость типа жилья и минимальной цены
  typePlace.addEventListener('change', changePrice);
  function changePrice () {
    switch (typePlace.value) {
      case 'bungalow':
        price.setAttribute('placeholder', 0);
        price.setAttribute('min', 0);
        break;
      case 'flat':
        price.setAttribute('placeholder', 1000);
        price.setAttribute('min', 1000);
        break;
      case 'hotel':
        price.setAttribute('placeholder', 3000);
        price.setAttribute('min', 3000);
        break;
      case 'house':
        price.setAttribute('placeholder', 5000);
        price.setAttribute('min', 5000);
        break;
      case 'palace':
        price.setAttribute('placeholder', 10000);
        price.setAttribute('min', 10000);
        break;
    }
  }
  return price.value >= +price.getAttribute('min');
}

function getPlacePriceErrorMessage () {
  return `Мин. цена = ${price.getAttribute('min')}`;
}

pristinePlacePrice.addValidator(price, validatePlacePrice, getPlacePriceErrorMessage);
//Синхронизация селектов времени выезда и заезда
const timeIn = form.querySelector('#timein');
const timeOut = form.querySelector('#timeout');
const containerTime = form.querySelector('.ad-form__element--time');

function changeTimeValue (evt) {
  if (evt.target.getAttribute('id') === 'timein') {
    timeOut.value = timeIn.value;
  } else {
    timeIn.value = timeOut.value;
  }
}

containerTime.addEventListener('change', changeTimeValue);

//Отправка и валидация формы
function setUserFormSubmit () {
  form.addEventListener('submit', (evt) => {
    evt.preventDefault();
    const isValidTitle = pristine.validate();
    const isValidRoomsGuests = pristineRoomsGuests.validate();
    const isValidPrice = pristinePlacePrice.validate();
    if (isValidTitle && isValidRoomsGuests && isValidPrice) {
      blockSubmitButton ();
      sendData(
        resetForms,
        () => {
          showSuccessMessage();
          unblockSubmitButton();
        },
        () => {
          showAlertMessage();
          unblockSubmitButton();
        },
        new FormData(evt.target)
      );
    }
  });
}

resetButton.addEventListener ('click', resetForms);

function resetForms () {
  const popup = document.querySelector('.leaflet-popup');
  if (popup) {
    popup.remove();
  }
  form.reset();
  mapFiltersForm.reset();
}

function showSuccessMessage () {
  document.body.append(templateSuccessMessage);
  document.addEventListener('click', () => clickEvent(templateSuccessMessage));
  document.addEventListener('keydown', (evt) => EscEvent(evt, templateSuccessMessage));
}

function showAlertMessage () {
  document.body.append(templateAlertMessage);
  document.addEventListener('click', () => clickEvent(templateAlertMessage));
  document.addEventListener('keydown', (evt) => EscEvent(evt, templateAlertMessage));
  errorButton.addEventListener('click', () => clickEvent(templateAlertMessage));
}

function blockSubmitButton () {
  submitButton.disabled = true;
  submitButton.textContent = 'Публикация...';
}

function unblockSubmitButton () {
  submitButton.disabled = false;
  submitButton.textContent = 'Опубликовать';
}

//Слайдер
function getSlider () {
  const sliderElement = form.querySelector('.ad-form__slider');
  noUiSlider.create (sliderElement, {
    range: {
      min: 1000,
      max: 100000
    },
    start: 1000,
    step: 1,
    connect: 'lower',
    format: {
      to: function (value) {
        return +value.toFixed(0);
      },
      from: function (value) {
        return parseFloat(value);
      }
    }
  });

  function checkSliderValue () {
    price.value = sliderElement.noUiSlider.get();
  }

  sliderElement.noUiSlider.on('update', checkSliderValue);

  function checkPriceValue () {
    sliderElement.noUiSlider.set(price.value);
  }

  price.addEventListener('change', checkPriceValue);

  function updateSliderOptions () {
    switch (typePlace.value) {
      case 'bungalow':
        sliderElement.noUiSlider.updateOptions({
          range: {
            min: 0,
            max: 100000
          },
          start: 0
        });
        break;
      case 'flat':
        sliderElement.noUiSlider.updateOptions({
          range: {
            min: 1000,
            max: 100000
          },
          start: 1000
        });
        break;
      case 'hotel':
        sliderElement.noUiSlider.updateOptions({
          range: {
            min: 3000,
            max: 100000
          },
          start: 3000
        });
        break;
      case 'house':
        sliderElement.noUiSlider.updateOptions({
          range: {
            min: 5000,
            max: 100000
          },
          start: 5000
        });
        break;
      case 'palace':
        sliderElement.noUiSlider.updateOptions({
          range: {
            min: 10000,
            max: 100000
          },
          start: 10000
        });
        break;
    }
  }

  typePlace.addEventListener('change', updateSliderOptions);
}
export { createInactiveCondition, createActiveCondition, getSlider, setUserFormSubmit };
