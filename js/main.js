import { getData } from './api.js';
import { createInactiveCondition, getSlider, setUserFormSubmit } from './form.js';
import './previewPhotos.js';
getSlider();
createInactiveCondition();
getData();
setUserFormSubmit();

