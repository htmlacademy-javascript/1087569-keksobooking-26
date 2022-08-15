function getRandomNumber(min, max, exp) {
  if (exp === undefined) {
      throw new Error ('Введите количество знаков после запятой');
  } else if (max > min && max >= 0 && min >= 0 && typeof(max) === 'number' && typeof(min) === 'number') {
    +min.toFixed(exp);
    +max.toFixed(exp);
    return parseFloat((Math.random() * (max - min) + min).toFixed(exp)); //Максимум и минимум включаются
  } else if (max === min) {
    return max;
  }
  throw new Error ('Некорректный тип данных');
}

const TITLES = [
  'Ярославль',
  'Казань',
  'Владивосток',
  'Краснодар',
  'Санкт-Петербург',
  'Москва',
  'Омск',
  'Рыбинск'
];

const TYPES = [
  'palace',
  'flat',
  'house',
  'bungalow',
  'hotel'
];

const TIMES = [
  '12:00',
  '13:00',
  '14:00'
];

const FEATURES = [
  'wifi',
  'dishwasher',
  'parking',
  'washer',
  'elevator',
  'conditioner'
];

const DESCRIPTIONS = [
  'Просторная комната',
  'Уютная комната',
  'Холл',
  'Спальня',
  'Кухня',
  'Прихожая',
  'Веранда'
];

const PHOTOS = [
  'https://assets.htmlacademy.ru/content/intensive/javascript-1/keksobooking/duonguyen-8LrGtIxxa4w.jpg',
  'https://assets.htmlacademy.ru/content/intensive/javascript-1/keksobooking/brandon-hoogenboom-SNxQGWxZQi0.jpg',
  'https://assets.htmlacademy.ru/content/intensive/javascript-1/keksobooking/claire-rendall-b6kAwr1i0Iw.jpg'
];

const AUTHORS = getArray(createAuthor,10);

//Функция строитель для автора
function createAuthor () {
  let num = getRandomNumber(1,10,0);
  if (num < 10) {
      num = '0' + num;
  }
  return `img/avatars/user${ num }.png`
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
  };
  return arr;
}
//Возвращает рандомный элемент из уже существующего массива
function getRandomElem (arr) {
  return arr[getRandomNumber(0,arr.length - 1,0)]
}
//Функция строитель для автора
function getAuthor () {
  return {
      avatar: getRandomElem(AUTHORS)
  };
}

function getFeature () {
  return getRandomElem(FEATURES);
}

function getPhoto () {
  return getRandomElem(PHOTOS);
}
//Функция строитель для локации
function createLocation () {
  return {
      lat: getRandomNumber(35.65000,35.70000,5),
      lng: getRandomNumber(139.70000,139.80000,5)
  };
}
//Создаём массив из объектов локации
function createLocationArr () {
  return Array.from({length:10},createLocation)
}
//Закрепляем массив локаций для дальнейшего перебора
const locationObj = createLocationArr();

function getOffer () {
  return {
      title: getRandomElem(TITLES),
      addres: locationObj[0]["lat"] + ", " + locationObj[0]["lng"],
      price:getRandomNumber(10000,100000,0),
      type: getRandomElem(TYPES),
      rooms: getRandomNumber(1,8,0),
      guests: getRandomNumber(1,20,0),
      checkin: getRandomElem(TIMES),
      checkout: getRandomElem(TIMES),
      features: getArray(getFeature, getRandomNumber(1,FEATURES.length,0)),
      description: getRandomElem(DESCRIPTIONS),
      photos: getArray(getPhoto,getRandomNumber(1,PHOTOS.length,0))
  };
}

function createAd () {
  return {
      author: getAuthor(),
      offer: getOffer(),
      location: locationObj[0]
  };
}

function getAds () {
  let arrayAds = [];
  for (let i = 0; i < 10; i++) {
  arrayAds.push(createAd());
  locationObj.shift();
  }
  return arrayAds;
}
console.log(getAds());
