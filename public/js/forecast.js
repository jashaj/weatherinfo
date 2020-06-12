'use strict';

import * as du from './domutils.js';
import {renderWeatherCondition} from './weather_condition.js';
import {formatHumidity, formatTemperature} from './formatters.js';

const locale = document.documentElement.getAttribute('lang');
const dateTimeFormat = new Intl.DateTimeFormat(locale, {weekday: 'short', hour: '2-digit', minute: '2-digit'});

function createRow(item) {
  const date = new Date(item.dt * 1000);
  const cellDate = du.createDomNode('th', dateTimeFormat.format(date));
  cellDate.setAttribute('scope', 'row');
  const {main = {}, weather = [{}]} = item;
  const cellWeatherCondition = du.createDomNode('td');
  renderWeatherCondition(weather[0], cellWeatherCondition);
  const cellTemperature = du.createDomNode('td', formatTemperature(main.temp));
  const cellHumidity = du.createDomNode('td', formatHumidity(main.humidity));

  return du.createDomNode('tr', cellDate, cellWeatherCondition, cellTemperature, cellHumidity);
}

export function renderForecast(weatherInfo) {
  const forecast = document.querySelector('#forecast');
  const existingForecast = forecast.querySelector('.forecastData');
  existingForecast.innerHTML = '';

  if (!weatherInfo || Number.parseInt(weatherInfo.cod, 10) !== 200) {
    console.debug("Failed to get forecast");
    du.hide(forecast);
    return;
  }

  du.show(forecast);

  const {list = []} = weatherInfo;

  list.forEach(item => existingForecast.appendChild(createRow(item)));
}