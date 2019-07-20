'use strict';
(function () {
    if (navigator.geolocation) {
        document.documentElement.classList.add('has-geo');
    }

    function WeatherApi() {
    }

    WeatherApi.prototype = (function () {
        const API_BASE = '/api/'; // 'https://api.openweathermap.org/data/2.5/';
        const API_CURRENT_WEATHER = 'weather';
        const API_FIVE_DAY_FORECAST = 'forecast'

        function _getData(api, queryParameters) {
            return window.fetch(`${API_BASE}${api}?units=metric${queryParameters}`)
                .then(response => response.json());
        }

        function _getCurrentForCity(city) {
            return _getData(API_CURRENT_WEATHER, `&q=${city}`);
        }

        function _getCurrentForCoordinates(longitude, latitude) {
            return _getData(API_CURRENT_WEATHER, `&lon=${longitude}&lat=${latitude}`);
        }

        function _getForecastForCity(city) {
            return _getData(API_FIVE_DAY_FORECAST, `&q=${city}`);
        }

        function _getForecastForCoordinates(longitude, latitude) {
            return _getData(API_FIVE_DAY_FORECAST, `&lon=${longitude}&lat=${latitude}`);
        }

        return {
            getCurrentForCity: _getCurrentForCity,
            getCurrentForCoordinates: _getCurrentForCoordinates,
            getForecastForCity: _getForecastForCity,
            getForecastForCoordinates: _getForecastForCoordinates
        }
    })();

    const weatherApi = new WeatherApi();

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
            .then(renderCurrentWeather)
            .catch(showError);

        weatherApi.getForecastForCity(location)
            .then(renderForecast)
            .catch(showError);
    }

    function renderCurrentWeather(weatherInfo) {
        const currentWeather = document.querySelector('#currentWeather');
        if (weatherInfo.cod != 200) {
            showError('No weather info available for this location. Choose a different location.');
            hide(currentWeather);
        }
        const { main = {}, name } = weatherInfo;
        const { temp, humidity } = main;

        document.querySelector('#temperature').value = formatTemperature(temp);
        document.querySelector('#humidity').value = formatHumidity(humidity);
        document.querySelector('#location').value = name || '';
        show(currentWeather);
    }

    function renderForecast(weatherInfo) {
        const forecast = document.querySelector('#forecast');
        const existingForecast = forecast.querySelector('table');
        if (existingForecast) {
            existingForecast.parentNode.removeChild(existingForecast);
        }

        if (weatherInfo.cod != 200) {
            console.debug("No weatherforecast");
            hide(forecast);
            return;
        }

        const { list = [] } = weatherInfo;

        const table = document.createElement('table');
        const head = document.createElement('thead');
        head.appendChild(document.createElement('th'));
        const body = document.createElement('tbody');
        const temperature = document.createElement('tr');
        const temperatureLabel = createDomNode('td', 'Temperature');
        temperatureLabel.setAttribute('scope', 'row');
        temperature.appendChild(temperatureLabel);

        const humidity = document.createElement('tr');
        const humidityLabel = createDomNode('td', 'Humidity');
        humidityLabel.setAttribute('scope', 'row');
        humidity.appendChild(humidityLabel);

        body.appendChild(temperature);
        body.appendChild(humidity);
        table.appendChild(head);
        table.appendChild(body);
        const dateOptions = { weekday: 'long' };
        const dateTimeFormat = new Intl.DateTimeFormat('en', dateOptions);
        list.forEach((item) => {
            const date = new Date(item.dt * 1000);

            if (date.getUTCHours() < 11 || date.getUTCHours() > 13) {
                return;
            }

            const th = createDomNode('th', dateTimeFormat.format(date));
            th.setAttribute('scope', 'column');
            head.appendChild(th);
            const { main = {} } = item;
            temperature.appendChild(createDomNode('td', formatTemperature(main.temp)));
            humidity.appendChild(createDomNode('td', formatHumidity(main.humidity)));
        });

        forecast.appendChild(table);
        show(forecast);
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
        var crd = pos.coords;

        weatherApi.getCurrentForCoordinates(crd.longitude, crd.latitude)
            .then(renderCurrentWeather)
            .catch(showError);

        weatherApi.getForecastForCoordinates(crd.longitude, crd.latitude)
            .then(renderForecast)
            .catch(showError);
    }

    function geolocationError(err) {
        console.debug(`ERROR(${err.code}): ${err.message}`);
        showError('Geolocation lookup failed');
        document.querySelector('#location').value = '';
    }



    function clearError() {
        const alertBox = getAlertBox();
        alertBox.textContent = '';
        hide(alertBox);;
    }

    function showError(message) {
        const alertBox = getAlertBox();
        show(alertBox);
        alertBox.textContent = message;
    }

    function getAlertBox() {
        return document.querySelector('#alert');
    }

    function createDomNode(elementName, text) {
        const el = document.createElement(elementName);
        el.textContent = text;
        return el;
    }

    function formatTemperature(temperature) {
        return isNaN(temperature) ? '' : `${temperature} \u00B0C`;
    }

    function formatHumidity(humidity) {
        return isNaN(humidity) ? '' : `${humidity}%`;
    }

    function hide(element) {
        element.setAttribute('aria-hidden', true);
    }

    function show(element) {
        element.setAttribute('aria-hidden', false);
    }
})();