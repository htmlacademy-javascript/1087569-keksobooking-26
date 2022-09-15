import { getData } from './api.js';
import { createInactiveCondition, getSlider, setUserFormSubmit } from './form.js';
import './preview-photos.js';
getSlider();
createInactiveCondition();
getData();
setUserFormSubmit();

