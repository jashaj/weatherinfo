'use strict';

import {showError} from './alert.js';
import * as du from './domutils.js';
import {formatHumidity, formatTemperature} from './formatters.js';
import {renderWeatherCondition} from './weather_condition.js';


function renderCurrentWeather(weatherInfo) {
  const currentWeather = document.querySelector('#currentWeather');
  if (!weatherInfo || Number.parseInt(weatherInfo.cod, 10) !== 200) {
    showError('No weather info available for this location. Choose a different location.');
    du.hide(currentWeather);
    return;
  }

  const {main = {}, weather = [{}]} = weatherInfo;
  const {temp, humidity} = main;

  currentWeather.querySelector('.temperature').textContent = formatTemperature(temp);
  currentWeather.querySelector('.humidity').textContent = formatHumidity(humidity);

  const currentCondition = currentWeather.querySelector('.currentCondition');
  currentCondition.innerHTML = '';
  renderWeatherCondition(weather[0], currentCondition);

  du.show(currentWeather);
  return weatherInfo;
}

export {renderCurrentWeather};