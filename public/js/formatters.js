'use strict';

export function formatTemperature(temperature) {
  return Number.isNaN(temperature) ? '' : `${Math.round(temperature)}\u00B0C`;
}

export function formatHumidity(humidity) {
  return Number.isNaN(humidity) ? '' : `${humidity}%`;
}
