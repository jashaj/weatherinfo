'use strict';
(function (weatherInfo) {
    if (!weatherInfo.API_KEY) {
        showError('Configure weatherInfo.API_KEY in key.js');
        return;
    }

    if (navigator.geolocation) {
        document.documentElement.classList.add('has-geo');
    }

    const WEATHER_API_BASE_URL = `https://api.openweathermap.org/data/2.5/weather?appid=${weatherInfo.API_KEY}&units=metric`;

    document.querySelector('#locationForm').addEventListener('submit', onLocationSubmitted, false);

    function onLocationSubmitted(event) {
        const form = event.currentTarget;

        if (form.reportValidity()) {
            const formData = new FormData(form);
            const location = formData.get('location');

            clearError();

            window.fetch(`${WEATHER_API_BASE_URL}&q=${location}`)
                .then(response => response.json())
                .then(renderCurrentWeather)
                .catch(showError);

            event.preventDefault();
        }
    }

    function renderCurrentWeather(weatherInfo) {
        const { main = {}, name } = weatherInfo;
        const { temp, humidity } = main;

        if (name === undefined) {
            showError('No weather info available for this location. Choose a different location.');
        }

        document.querySelector('#temperature').value = temp || '';
        document.querySelector('#humidity').value = humidity || '';
        document.querySelector('#location').value = name || '';
    }

    document.querySelector('#currentLocation').addEventListener('click', onCurrentLocationClicked, false);

    function onCurrentLocationClicked(event) {
        clearError();

        const options = {
            enableHighAccuracy: false,
            timeout: 5000,
            maximumAge: 0
        };
        navigator.geolocation.getCurrentPosition(geolocationSuccess, geolocationError, options);
    }

    function geolocationSuccess(pos) {
        var crd = pos.coords;

        // Duplication of the form submit. Need to eliminate it
        window.fetch(`${WEATHER_API_BASE_URL}&lat=${crd.latitude}&lon=${crd.longitude}`)
            .then(response => response.json())
            .then(renderCurrentWeather)
            .catch(showError);

    }

    function geolocationError(err) {
        // Show some warning on the page to the user
        console.debug(`ERROR(${err.code}): ${err.message}`);
        showError('Geolocation lookup failed');
        document.querySelector('#location').value = '';
    }

    const alertBox = document.querySelector('#alert');

    function clearError() {
        alertBox.setAttribute('aria-hidden', true);
        alertBox.textContent = '';
    }

    function showError(message) {
        alertBox.setAttribute('aria-hidden', false);
        alertBox.textContent = message;
    }
})(weatherInfo);