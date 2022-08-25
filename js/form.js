const form = document.querySelector('.ad-form');
const fieldsetsForm = form.querySelectorAll('fieldset'); //Оболочки для формы
const mapFiltersForm = document.querySelector('.map__filters');
const selectArrOfMap = mapFiltersForm.querySelectorAll('select'); //Коллекция селектов карты(фильтры)
const fieldsetsMap = mapFiltersForm.querySelector('fieldset');
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

const pristine = new Pristine(form, {
  classTo: 'ad-form__element',
  errorTextParent: 'ad-form__element',
  errorTextClass: 'error-text'
});

const pristineRoomsGuests = new Pristine (form, {
  classTo: 'rooms_guests',
  errorTextParent: 'rooms_guests',
  errorTextClass: 'error-text'
});

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
pristineRoomsGuests.addValidator(countGuests, validateRoomsGuests, getRoomsGuestsErrorMessage);

form.addEventListener('submit', (evt) => {
  evt.preventDefault();
  pristine.validate();
  pristineRoomsGuests.validate();
});
export { createInactiveCondition, createActiveCondition };
