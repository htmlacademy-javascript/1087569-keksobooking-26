import { debounce } from './util.js';
import {  createActiveCondition, getFilterAd } from './form.js';
import { renderAds } from './render.js';

const mapFiltersForm = document.querySelector('.map__filters');
const address = document.querySelector('#address');
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

const map = L.map('map-canvas')
  .setView({
    lat: TOKIO_LAT,
    lng: TOKIO_LNG
  }, 11);

const markerGroup = L.layerGroup().addTo(map);

let offers = [];

function mapReturnDefault () {
  mainMarker.setLatLng({
    lat: TOKIO_LAT,
    lng: TOKIO_LNG
  });

  map.setView({
    lat: TOKIO_LAT,
    lng: TOKIO_LNG
  }, 11);
  markerGroup.clearLayers();
  renderLayer(offers);
}

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

function renderLayer (dataOffers) {
  dataOffers.slice(0, MARKERS_COUNT).forEach((offer) => createMarker(offer));
}

function renderMap (ads) {
  L.tileLayer(
    'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
    {
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
    },
  ).addTo(map);
  offers = ads;
  createActiveCondition();
  mainMarker.addTo(map);
  //Зависимость главной метки со значением адреса
  function getAddress (evt) {
    address.value = `${evt.target.getLatLng()['lat'].toFixed(5)}, ${evt.target.getLatLng()['lng'].toFixed(5)}`;
  }
  mainMarker.on('moveend', getAddress);
  renderLayer (ads);

  mapFiltersForm.addEventListener ('change', debounce(() => {
    const houseFeatures = document.querySelectorAll('input[type="checkbox"]:checked');
    const featuresArr = [];
    houseFeatures.forEach((feature) => featuresArr.push(feature.value));
    const filterAds = ads.slice().filter((ad) => getFilterAd(ad, featuresArr));
    markerGroup.clearLayers();
    filterAds.slice(0, MARKERS_COUNT).forEach((ad) => createMarker(ad));
  }), RERENDER_DELAY);
}

export { renderMap, mapReturnDefault };
