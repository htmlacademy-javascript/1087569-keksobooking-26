function renderAds (ads) {
  const templateAd = document.querySelector('#card').content.querySelector('.popup');
  const containerAds = document.querySelector('#map-canvas');
  const fragment = document.createDocumentFragment();
  const adItem = templateAd.cloneNode(true);
  const title = adItem.querySelector('.popup__title');
  const address = adItem.querySelector('.popup__text--address');
  const typePlace = adItem.querySelector('.popup__type');
  const price = adItem.querySelector('.popup__text--price');
  const roomsGuests = adItem.querySelector('.popup__text--capacity');
  const checkInOut = adItem.querySelector('.popup__text--time');
  const containerFeatures = adItem.querySelector('.popup__features');
  const description = adItem.querySelector('.popup__description');
  const containerPhotos = adItem.querySelector('.popup__photos');
  const avatarImg = adItem.querySelector('.popup__avatar');
  if (ads.offer.title) {
    title.textContent = ads.offer.title;
  } else {hideBlock(title);}
  if (ads.offer.address) {
    address.textContent = ads.offer.address;
  } else {hideBlock(address);}
  if (ads.offer.price) {
    price.textContent = `${ads.offer.price} ₽/ночь`;
  } else {hideBlock(price);}
  //Сопоставление типа места
  if (ads.offer.type) {
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
    }
  } else {hideBlock(typePlace);}
  //Учитываем верное склонение для кол-ва комнат и добавляем в текстовое содержимое
  if (ads.offer.rooms && ads.offer.guests) {
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
  } else {hideBlock(roomsGuests);}
  if (ads.offer.checkin && ads.offer.checkout) {
    checkInOut.textContent = `Заезд после ${ads.offer.checkin}, выезд до ${ads.offer.checkout}`;
  } else {hideBlock(checkInOut);}
  if (ads.offer.features.length > 1) {
    getFeatures();
  } else {hideBlock(containerFeatures);}
  if (ads.offer.description) {
    description.textContent = ads.offer.description;
  } else {hideBlock(description);}
  if (ads.offer.photos) {
    getPhotos();
  } else {hideBlock(containerPhotos);}
  if (ads.author.avatar) {
    avatarImg.src = ads.author.avatar;
  } else {hideBlock(avatarImg);}
  fragment.appendChild(adItem);
  containerAds.appendChild(fragment);
  function getFeatures () {
    const features = ads.offer.features;
    containerFeatures.innerHTML = '';
    for (let i = 0; i < features.length; i++) {
      const featureElem = document.createElement('li');
      featureElem.classList.add('popup__feature', `popup__feature--${features[i]}`);
      containerFeatures.appendChild(featureElem);
    }
  }
  function getPhotos () {
    const photos = ads.offer.photos;
    for (let i = 0; i < photos.length; i++) {
      const templatePhoto = containerPhotos.querySelector('.popup__photo').cloneNode(true);
      templatePhoto.src = photos[i];
      containerPhotos.appendChild(templatePhoto);
    }
    containerPhotos.querySelectorAll('img')[0].remove();
  }
  function hideBlock (block) {
    block.style.display = 'none';
  }
}

export { renderAds };
