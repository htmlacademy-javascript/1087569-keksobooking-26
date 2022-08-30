import { getAds } from './data.js';
import { createInactiveCondition, getSlider } from './form.js';
import { renderMap } from './map.js';
const ads = getAds();
getSlider();
createInactiveCondition();
renderMap(ads);

