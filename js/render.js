/* eslint-disable no-return-assign */
function renderAds (ads) {
  const templateAd = document.querySelector('#card').content.querySelector('.popup');
  const containerAds = document.querySelector('#map-canvas');
  const fragment = document.createDocumentFragment();
  const adItem = templateAd.cloneNode(true);
  const typePlace = adItem.querySelector('.popup__type');
  const roomsGuests = adItem.querySelector('.popup__text--capacity');
  adItem.querySelector('.popup__title').textContent = ads.offer.title;
  adItem.querySelector('.popup__text--address').textContent = ads.offer.address;
  adItem.querySelector('.popup__text--price').textContent = `${ads.offer.price} ₽/ночь`;
  //Сопоставление типа места
  switch (ads.offer.type) {
    case 'flat':
      typePlace.textContent = 'Квартира';
      break;
    case 'bungalow':
      typePlace.textContent = 'Бунгало';
      break;
    case 'house':
      typePlace.textContent = 'Дом';
      break;
    case 'palace':
      typePlace.textContent = 'Дворец';
      break;
    case 'hotel':
      typePlace.textContent = 'Отель';
      break;
    default:
      typePlace.textContent = 'Нет данных';
  }
  //Учитываем верное склонение для кол-ва комнат и добавляем в текстовое содержимое
  switch (ads.offer.rooms) {
    case 1:
      roomsGuests.textContent = `${ads.offer.rooms} комната`;
      break;
    case 2:
    case 3:
    case 4:
      roomsGuests.textContent = `${ads.offer.rooms} комнаты`;
      break;
    case 5:
    case 6:
    case 7:
    case 8:
      roomsGuests.textContent = `${ads.offer.rooms} комнат`;
      break;
  }
  //Добавляем информацию о количестве гостей, учитывая склонение
  if (ads.offer.guests !== 1) {
    roomsGuests.textContent += ` для ${ads.offer.guests} гостей`;
  } else {
    roomsGuests.textContent += ` для ${ads.offer.guests} гостя`;
  }
  adItem.querySelector('.popup__text--time').textContent = `Заезд после ${ads.offer.checkin}, выезд до ${ads.offer.checkout}`;
  getFeatures();
  adItem.querySelector('.popup__description').textContent = ads.offer.description;
  getPhotos();
  adItem.querySelector('.popup__avatar').src = ads.author.avatar;
  fragment.appendChild(adItem);
  containerAds.appendChild(fragment);
  checkViewElem ();
  function getFeatures () {
    const features = ads.offer.features;
    const containerFeatures = adItem.querySelector('.popup__features');
    containerFeatures.innerHTML = '';
    for (let i = 0; i < features.length; i++) {
      const featureElem = document.createElement('li');
      featureElem.classList.add('popup__feature', `popup__feature--${features[i]}`);
      containerFeatures.appendChild(featureElem);
    }
  }
  function getPhotos () {
    const photos = ads.offer.photos;
    const containerPhotos = adItem.querySelector('.popup__photos');
    for (let i = 0; i < photos.length; i++) {
      const templatePhoto = containerPhotos.querySelector('.popup__photo').cloneNode(true);
      templatePhoto.src = photos[i];
      containerPhotos.appendChild(templatePhoto);
    }
    containerPhotos.querySelectorAll('img')[0].remove();
  }
  function checkViewElem () {
    const textElements= [
      adItem.querySelector('.popup__title'),
      adItem.querySelector('.popup__text--address'),
      adItem.querySelector('.popup__text--price'),
      typePlace,
      roomsGuests,
      adItem.querySelector('.popup__text--time'),
      adItem.querySelector('.popup__description')
    ];
    const images = containerAds.querySelectorAll('img');
    const features = containerAds.querySelector('ul');
    textElements.forEach((elem) => {
      if (elem.textContent === undefined || elem.textContent === null || elem.textContent === '') {
        elem.style.display = 'none';
      }
    });
    images.forEach((elem) => {
      elem.onerror = () => elem.style.display = 'none';
    });
    if (features.children.length < 1) {
      features.style.display = 'none';
    }
  }
}

export { renderAds };
