function getRandomNumber(min, max, exp) {
  if (exp === undefined) {
    throw new Error ('Введите количество знаков после запятой');
  } else if (max > min && max >= 0 && min >= 0 && typeof(max) === 'number' && typeof(min) === 'number') {
    Number(min.toFixed(exp));
    Number(max.toFixed(exp));
    return parseFloat((Math.random() * (max - min) + min).toFixed(exp)); //Максимум и минимум включаются
  } else if (max === min) {
    return max;
  }
  throw new Error ('Некорректный тип данных');
}

//Создаёт массив используя функцию строитель и необходимую длину массива
function getArray (createFunction, arrayLength) {
  let arr = [];
  arr.push(createFunction());
  while (arr.length < arrayLength) {
    const elem = createFunction();
    if (!arr.includes(elem)) {
      arr.push(elem);
    }
  }
  return arr;
}
//Возвращает рандомный элемент из уже существующего массива
function getRandomElem (arr) {
  return arr[getRandomNumber(0,arr.length - 1,0)];
}

//Создаёт контейнер для вывода ошибки
function showAlert (message) {
  const ALERT_SHOW_TIME = 5000;
  const alertContainer = document.createElement('div');
  alertContainer.style.zIndex = '100';
  alertContainer.style.position = 'absolute';
  alertContainer.style.top = '0';
  alertContainer.style.right = '0';
  alertContainer.style.padding = '10px 3px';
  alertContainer.style.fontSize = '18px';
  alertContainer.style.textAlign = 'center';
  alertContainer.style.width = '35%';
  alertContainer.style.backgroundColor = '#ffaa99';
  alertContainer.style.color = 'white';
  alertContainer.style.borderRadius = '5px';

  alertContainer.textContent = message;

  document.body.append(alertContainer);

  setTimeout(() => {
    alertContainer.remove();
  }, ALERT_SHOW_TIME);
}

//Удаляет блок по клику в произвольной области
function clickEvent (block) {
  block.remove();
  document.removeEventListener('click', clickEvent);
}

//Удаляет блок при нажатии Esc
function EscEvent (evt, block) {
  if (evt.code === 'Escape') {
    block.remove();
  }
  document.removeEventListener('keydown', EscEvent);
}

function debounce (callback, timeoutDelay = 500) {
  // Используем замыкания, чтобы id таймаута у нас навсегда приклеился
  // к возвращаемой функции с setTimeout, тогда мы его сможем перезаписывать
  let timeoutId;

  return (...rest) => {
    // Перед каждым новым вызовом удаляем предыдущий таймаут,
    // чтобы они не накапливались
    clearTimeout(timeoutId);

    // Затем устанавливаем новый таймаут с вызовом колбэка на ту же задержку
    timeoutId = setTimeout(() => callback.apply(this, rest), timeoutDelay);

    // Таким образом цикл «поставить таймаут - удалить таймаут» будет выполняться,
    // пока действие совершается чаще, чем переданная задержка timeoutDelay
  };
}
export {getRandomNumber, getArray, getRandomElem, showAlert, clickEvent, EscEvent, debounce};
