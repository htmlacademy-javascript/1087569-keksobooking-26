import { debounce } from './util.js';
import {  createActiveCondition, getFilterAd } from './form.js';
import { renderAds } from './render.js';

const mapFiltersForm = document.querySelector('.map__filters');
const address = document.querySelector('#address');
const resetButton = document.querySelector('.ad-form__reset');
const MARKERS_COUNT = 10;
const RERENDER_DELAY = 500;
const TOKIO_LAT = 35.78912;
const TOKIO_LNG = 139.80931;

const mainMarkerIcon = L.icon({
  iconUrl: './img/main-pin.svg',
  iconSize: [52, 52],
  iconAnchor: [26, 52],
});

const mainMarker =  L.marker(
  {
    lat: TOKIO_LAT,
    lng: TOKIO_LNG
  },
  {
    draggable: true,
    icon: mainMarkerIcon
  }
);

const icon = L.icon({
  iconUrl: './img/pin.svg',
  iconSize: [40, 40],
  iconAnchor: [20, 40],
});

function renderMap (ads) {
  const map = L.map('map-canvas')
    .on('load', createActiveCondition
    ).setView({
      lat: TOKIO_LAT,
      lng: TOKIO_LNG
    }, 11);

  L.tileLayer(
    'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
    {
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
    },
  ).addTo(map);

  mainMarker.addTo(map);
  //Зависимость главной метки со значением адреса
  function getAddress (evt) {
    address.value = `${evt.target.getLatLng()['lat'].toFixed(5)}, ${evt.target.getLatLng()['lng'].toFixed(5)}`;
  }

  mainMarker.on('moveend', getAddress);

  function returnDefaultOptions () {
    mainMarker.setLatLng({
      lat: TOKIO_LAT,
      lng: TOKIO_LNG
    });

    map.setView({
      lat: TOKIO_LAT,
      lng: TOKIO_LNG
    }, 11);
  }

  resetButton.addEventListener('click', returnDefaultOptions);

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
