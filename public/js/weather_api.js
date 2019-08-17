'use strict';

const _API_CURRENT_WEATHER = 'weather';
const _API_FIVE_DAY_FORECAST = 'forecast';

function _getData(api, queryParameters) {
  return window.fetch(`/api/${api}?units=metric${queryParameters}`)
      .then(response => response.json());
}

export function getCurrentForCity(city) {
  return _getData(_API_CURRENT_WEATHER, `&q=${city}`);
}

export function getCurrentForCoordinates(longitude, latitude) {
  return _getData(_API_CURRENT_WEATHER, `&lon=${longitude}&lat=${latitude}`);
}

export function getForecastForCity(city) {
  return _getData(_API_FIVE_DAY_FORECAST, `&q=${city}`);
}

export function getForecastForCoordinates(longitude, latitude) {
  return _getData(_API_FIVE_DAY_FORECAST, `&lon=${longitude}&lat=${latitude}`);
}


