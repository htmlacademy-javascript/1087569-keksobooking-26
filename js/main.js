import { getAds } from './data.js';
import { renderAds } from './render.js';
import { createInactiveCondition, createActiveCondition } from './form.js';
const ads = getAds();
renderAds(ads[0]);
createInactiveCondition();
createActiveCondition();
