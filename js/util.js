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

export {getRandomNumber, getArray, getRandomElem};
