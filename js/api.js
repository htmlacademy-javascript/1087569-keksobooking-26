import { renderMap } from './map.js';
import { showAlert } from './util.js';
function getData () {
  fetch('https://26.javascript.pages.academy/keksobooking/data')
    .then((response) => response.json())
    .then((response) => {
      renderMap(response);
    })
    .catch(() => {
      showAlert('Не удалось загрузить объявления. Попробуйте позже');
      renderMap();
    });
}

function sendData (resetForms, showSuccessMessage, showAlertMessage, body) {
  fetch(
    'https://26.javascript.pages.academy/keksobooking',
    {
      method: 'POST',
      body
    }
  )
    .then((response) => {
      if (response.ok) {
        resetForms();
        showSuccessMessage();
      } else {
        showAlertMessage();
      }
    })
    .catch(() => showAlert('Ошибка размещения объявления'));
}
export { getData, sendData };
