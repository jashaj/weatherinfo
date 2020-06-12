'use strict';

import * as du from './domutils.js';

function _getAlertBox() {
  return document.querySelector('#alert');
}

function clearError() {
  const alertBox = _getAlertBox();
  alertBox.textContent = '';
  du.hide(alertBox);
}

function showError(message) {
  const alertBox = _getAlertBox();
  du.show(alertBox);
  alertBox.textContent = message;
}

export {clearError, showError};