const FILE_TYPES = ['gif', 'jpg', 'jpeg', 'png'];
const avatar = document.querySelector('#avatar');
const photoForAd = document.querySelector('#images');
const avatarContainer = document.querySelector('.ad-form-header__preview').querySelector('img');
const photoForAdContainer = document.querySelector('.ad-form__photo');

function checkTypeHandler (file) {
  const fileName = file.name.toLowerCase();
  return FILE_TYPES.some((it) => fileName.endsWith(it));
}

avatar.addEventListener('change', () => {
  const file = avatar.files[0];
  const matches = checkTypeHandler(file);
  if (matches) {
    avatarContainer.src = URL.createObjectURL(file);
  }
});

photoForAd.addEventListener('change', () => {
  const file = photoForAd.files[0];
  const matches = checkTypeHandler(file);
  if (matches) {
    const photoImg = document.createElement('img');
    photoImg.src = URL.createObjectURL(file);
    photoImg.setAttribute('width', 70);
    photoImg.setAttribute('height', 70);
    photoForAdContainer.append(photoImg);
  }

});

export {avatarContainer, photoForAdContainer};

