'use strict';
import * as weatherApi from './js/weather_api.js';
import {clearError, showError} from './js/alert.js';
import {renderForecast} from './js/forecast.js';
import {renderCurrentWeather} from './js/current_weather.js';

(function () {
  if (navigator.geolocation) {
    document.documentElement.classList.add('has-geo');
  }

  document.addEventListener('location:updated', event => {
    event.stopPropagation();
    document.querySelector('#location').value = event.detail.name || '';
  }, false);

  const urlParams = new URLSearchParams(location.search);
  if (urlParams.has('location')) {
    const location = urlParams.get('location');
    if (location) {
      showWeatherForLocation(location);
    }
  }

  document.querySelector('#locationForm').addEventListener('submit', onLocationSubmitted, false);

  function onLocationSubmitted(event) {
    const form = event.currentTarget;

    if (form.reportValidity()) {
      const formData = new FormData(form);
      const location = formData.get('location');

      showWeatherForLocation(location);
      event.preventDefault();
    }
  }

  function showWeatherForLocation(location) {
    clearError();

    weatherApi.getCurrentForCity(location)
        .then(updateUrlAndTitle)
        .then(renderCurrentWeather)
        .catch(showError);

    weatherApi.getForecastForCity(location)
        .then(renderForecast)
        .catch(showError);
  }

  document.querySelector('#currentLocation').addEventListener('click', onCurrentLocationClicked, false);

  function onCurrentLocationClicked(event) {
    clearError();
    event.stopPropagation();

    const options = {
      enableHighAccuracy: false,
      timeout: 5000,
      maximumAge: 0
    };
    navigator.geolocation.getCurrentPosition(geolocationSuccess, geolocationError, options);
  }

  function geolocationSuccess(pos) {
    const crd = pos.coords;

    weatherApi.getCurrentForCoordinates(crd.longitude, crd.latitude)
        .then(updateUrlAndTitle)
        .then(renderCurrentWeather)
        .catch(showError);

    weatherApi.getForecastForCoordinates(crd.longitude, crd.latitude)
        .then(renderForecast)
        .catch(showError);
  }

  function geolocationError(err) {
    console.debug(`ERROR(${err.code}): ${err.message}`);
    showError('Geolocation lookup failed');
    document.dispatchEvent(new CustomEvent('location:updated', {bubbles: true, detail: {name: ''}}));
  }

  function updateUrlAndTitle(weatherInfo) {
    const location = weatherInfo.name || '';
    document.dispatchEvent(new CustomEvent('location:updated', {bubbles: true, detail: {name: location}}));

    const title = `Weather info for ${location}`;
    document.title = title;
    window.history.replaceState({}, title, `?location=${location}`);
    return weatherInfo;
  }


})();
