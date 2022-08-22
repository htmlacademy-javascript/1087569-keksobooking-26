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

export { createInactiveCondition, createActiveCondition };
