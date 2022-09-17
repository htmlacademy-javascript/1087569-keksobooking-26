import { clickEvent, escEvent } from './util.js';
import { sendData } from './api.js';
import { avatarContainer, photoForAdContainer } from './preview-photos.js';
import { returnDefaultOptionsHandler } from './map.js';
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

const typePlace = form.querySelector('#type');//Тип жилья
const price = form.querySelector('#price'); //Цена за ночь
const timeIn = form.querySelector('#timein');
const timeOut = form.querySelector('#timeout');
const containerTime = form.querySelector('.ad-form__element--time');
const houseType = mapFiltersForm.querySelector('#housing-type');
const housePrice = mapFiltersForm.querySelector('#housing-price');
const houseRooms = mapFiltersForm.querySelector('#housing-rooms');
const houseGuests = mapFiltersForm.querySelector('#housing-guests');
const sliderElement = form.querySelector('.ad-form__slider');
const SUCCESS_RATE = 5;
const DEFAULT_PRICE = 1000;
const BUNGALOW_MIN_PRICE = 0;
const FLAT_MIN_PRICE = 1000;
const HOTEL_MIN_PRICE = 3000;
const HOUSE_MIN_PRICE = 5000;
const PALACE_MIN_PRICE = 10000;
const MAX_PRICE = 100000;
const bungalow = 'bungalow';
const flat = 'flat';
const hotel = 'hotel';
const house = 'house';
const palace = 'palace';
const LOW_FILTER_PRICE = 'low';
const MIDDLE_FILTER_PRICE = 'middle';
const HIGH_FILTER_PRICE = 'high';
const LOW_FILTER_PRICE_MAX = 10000;
const MIDDLE_FILTER_PRICE_MIN = 10000;
const MIDDLE_FILTER_PRICE_MAX = 50000;
const HIGH_FILTER_PRICE_MIN = 50000;
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
price.setAttribute('min', DEFAULT_PRICE);//Задаём значение атрибута min по умолчанию для корректной работы pristine

function validatePlacePrice () {
  //Слушатель отражающий зависимость типа жилья и минимальной цены
  typePlace.addEventListener('change', changePriceHandler);
  function changePriceHandler () {
    switch (typePlace.value) {
      case bungalow:
        price.setAttribute('placeholder', BUNGALOW_MIN_PRICE);
        price.setAttribute('min', BUNGALOW_MIN_PRICE);
        break;
      case flat:
        price.setAttribute('placeholder', FLAT_MIN_PRICE);
        price.setAttribute('min', FLAT_MIN_PRICE);
        break;
      case hotel:
        price.setAttribute('placeholder', HOTEL_MIN_PRICE);
        price.setAttribute('min', HOTEL_MIN_PRICE);
        break;
      case house:
        price.setAttribute('placeholder', HOUSE_MIN_PRICE);
        price.setAttribute('min', HOUSE_MIN_PRICE);
        break;
      case palace:
        price.setAttribute('placeholder', PALACE_MIN_PRICE);
        price.setAttribute('min', PALACE_MIN_PRICE);
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
function changeTimeValueHandler (evt) {
  if (evt.target.getAttribute('id') === 'timein') {
    timeOut.value = timeIn.value;
  } else {
    timeIn.value = timeOut.value;
  }
}

containerTime.addEventListener('change', changeTimeValueHandler);

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
        resetFormsHandler,
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

resetButton.addEventListener ('click', resetFormsHandler);

function resetFormsHandler () {
  const popup = document.querySelector('.leaflet-popup');
  const photoElem = photoForAdContainer.firstChild;
  returnDefaultOptionsHandler();
  if (popup) {
    popup.remove();
  }
  form.reset();
  mapFiltersForm.reset();
  avatarContainer.src = 'img/muffin-grey.svg';
  if (photoElem) {
    photoElem.remove();
  }
}

function showSuccessMessage () {
  document.body.append(templateSuccessMessage);
  document.addEventListener('click', () => clickEvent(templateSuccessMessage), {once: true});
  document.addEventListener('keydown', (evt) => escEvent(evt, templateSuccessMessage), {once: true});
}

function showAlertMessage () {
  document.body.append(templateAlertMessage);
  document.addEventListener('click', () => clickEvent(templateAlertMessage), {once: true});
  document.addEventListener('keydown', (evt) => escEvent(evt, templateAlertMessage), {once: true});
  errorButton.addEventListener('click', () => clickEvent(templateAlertMessage), {once: true});
}

function blockSubmitButton () {
  submitButton.disabled = true;
  submitButton.textContent = 'Публикация...';
}

function unblockSubmitButton () {
  submitButton.disabled = false;
  submitButton.textContent = 'Опубликовать';
}

//Фильтрация меток карты
function getFilterAd (ad, features) {
  let filterRate = 0;
  //Тип жилья
  if (ad.offer.type === houseType.value || houseType.value === 'any') {
    filterRate += 1;
  }
  //Цена
  switch(housePrice.value) {
    case LOW_FILTER_PRICE:
      if (ad.offer.price < LOW_FILTER_PRICE_MAX) {
        filterRate +=1;
      }
      break;
    case MIDDLE_FILTER_PRICE:
      if (ad.offer.price >= MIDDLE_FILTER_PRICE_MIN && ad.offer.price < MIDDLE_FILTER_PRICE_MAX) {
        filterRate += 1;
      }
      break;
    case HIGH_FILTER_PRICE:
      if (ad.offer.price >= HIGH_FILTER_PRICE_MIN) {
        filterRate += 1;
      }
      break;
    default:
      filterRate += 1;
  }
  //Кол-во комнат
  if (ad.offer.rooms === +houseRooms.value || houseRooms.value === 'any') {
    filterRate += 1;
  }
  //Кол-во гостей
  if (ad.offer.guests === +houseGuests.value || houseGuests.value === 'any') {
    filterRate += 1;
  }
  //Удобства
  if (ad.offer.features) {
    //Массив с удобствами, которые отсутствуют в объявлении
    const withoutFeatures =  features.filter((feature) => !ad.offer.features.includes(feature));
    if (withoutFeatures.length === 0) {
      filterRate += 1;
    }
  }
  return filterRate >= SUCCESS_RATE;
}

//Слайдер
function getSlider () {
  noUiSlider.create (sliderElement, {
    range: {
      min: DEFAULT_PRICE,
      max: MAX_PRICE
    },
    start: DEFAULT_PRICE,
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

  function checkSliderValueHandler () {
    price.value = sliderElement.noUiSlider.get();
  }

  sliderElement.noUiSlider.on('update', checkSliderValueHandler);

  function checkPriceValueHandler () {
    sliderElement.noUiSlider.set(price.value);
  }

  price.addEventListener('change', checkPriceValueHandler);

  function updateSliderOptions () {
    switch (typePlace.value) {
      case bungalow:
        sliderElement.noUiSlider.updateOptions({
          range: {
            min: BUNGALOW_MIN_PRICE,
            max: MAX_PRICE
          },
          start: BUNGALOW_MIN_PRICE
        });
        break;
      case flat:
        sliderElement.noUiSlider.updateOptions({
          range: {
            min: FLAT_MIN_PRICE,
            max: MAX_PRICE
          },
          start: FLAT_MIN_PRICE
        });
        break;
      case hotel:
        sliderElement.noUiSlider.updateOptions({
          range: {
            min: HOTEL_MIN_PRICE,
            max: MAX_PRICE
          },
          start: HOTEL_MIN_PRICE
        });
        break;
      case house:
        sliderElement.noUiSlider.updateOptions({
          range: {
            min: HOUSE_MIN_PRICE,
            max: MAX_PRICE
          },
          start: HOUSE_MIN_PRICE
        });
        break;
      case palace:
        sliderElement.noUiSlider.updateOptions({
          range: {
            min: PALACE_MIN_PRICE,
            max: MAX_PRICE
          },
          start: PALACE_MIN_PRICE
        });
        break;
    }
  }

  typePlace.addEventListener('change', updateSliderOptions);
}
export { createInactiveCondition, createActiveCondition, getSlider, setUserFormSubmit, getFilterAd };
