import { debounce } from './util.js';
import {  createActiveCondition, getFilterAd } from './form.js';
import { renderAds } from './render.js';

const mapFiltersForm = document.querySelector('.map__filters');
const MARKERS_COUNT = 10;
const RERENDER_DELAY = 500;
function renderMap (ads) {
  const map = L.map('map-canvas')
    .on('load', createActiveCondition
    ).setView({
      lat: 35.78912,
      lng: 139.80931
    }, 11);

  L.tileLayer(
    'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
    {
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
    },
  ).addTo(map);

  const mainMarkerIcon = L.icon({
    iconUrl: './img/main-pin.svg',
    iconSize: [52, 52],
    iconAnchor: [26, 52],
  });

  const mainMarker =  L.marker(
    {
      lat: 35.78912,
      lng: 139.80931
    },
    {
      draggable: true,
      icon: mainMarkerIcon
    }
  );

  mainMarker.addTo(map);

  //Задаём значение адреса по умолчанию
  const address = document.querySelector('#address');

  //Зависимость главной метки со значением адреса
  function getAddress (evt) {
    address.value = `${evt.target.getLatLng()['lat'].toFixed(5)}, ${evt.target.getLatLng()['lng'].toFixed(5)}`;
  }

  mainMarker.on('moveend', getAddress);

  const resetButton = document.querySelector('.ad-form__reset');
  function returnDefaultOptions () {
    mainMarker.setLatLng({
      lat: 35.78912,
      lng: 139.80931
    });

    map.setView({
      lat: 35.78912,
      lng: 139.80931
    }, 11);
  }

  resetButton.addEventListener('click', returnDefaultOptions);

  const icon = L.icon({
    iconUrl: './img/pin.svg',
    iconSize: [40, 40],
    iconAnchor: [20, 40],
  });
  const markerGroup = L.layerGroup().addTo(map);
  function createMarker (ad) {
    const lat = ad['location']['lat'];
    const lng = ad['location']['lng'];
    const marker = L.marker(
      {
        lat,
        lng
      },
      {
        icon
      });

    marker.addTo(markerGroup).bindPopup(renderAds(ad));
  }

  ads.slice(0, MARKERS_COUNT).forEach((ad) => createMarker(ad));

  mapFiltersForm.addEventListener ('change', debounce(() => {
    const houseFeatures = document.querySelectorAll('input[type="checkbox"]:checked');
    // eslint-disable-next-line prefer-const
    let FeaturesArr = [];
    houseFeatures.forEach((feature) => FeaturesArr.push(feature.value));
    const filterAds = ads.slice().filter((ad) => getFilterAd(ad, FeaturesArr));
    markerGroup.clearLayers();
    filterAds.slice(0, MARKERS_COUNT).forEach((ad) => createMarker(ad));
  }), RERENDER_DELAY);
}

export { renderMap };
