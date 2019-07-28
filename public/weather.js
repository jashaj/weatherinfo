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
        const { main = {}, weather = [{}], name } = weatherInfo;
        const { temp, humidity } = main;

        document.querySelector('#temperature').value = formatTemperature(temp);
        document.querySelector('#humidity').value = formatHumidity(humidity);
        document.querySelector('#location').value = name || '';

        const currentCondition = document.querySelector('#currentCondition');
        currentCondition.innerHTML = '';
        renderWeatherCondition(weather[0], currentCondition);

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
        const headRow = document.createElement('tr');
        headRow.appendChild(document.createElement('th'));
        head.appendChild(headRow);
        const body = document.createElement('tbody');
        const condition = document.createElement('tr');
        const conditionLabel = createDomNode('th', 'Condition');
        conditionLabel.setAttribute('scope', 'row');
        condition.appendChild(conditionLabel);
        const temperature = document.createElement('tr');
        const temperatureLabel = createDomNode('th', 'Temperature');
        temperatureLabel.setAttribute('scope', 'row');
        temperature.appendChild(temperatureLabel);

        const humidity = document.createElement('tr');
        const humidityLabel = createDomNode('th', 'Humidity');
        humidityLabel.setAttribute('scope', 'row');
        humidity.appendChild(humidityLabel);

        body.appendChild(condition);
        body.appendChild(temperature);
        body.appendChild(humidity);
        table.appendChild(head);
        table.appendChild(body);
        const dateOptions = { weekday: 'narrow', hour: '2-digit' };
        const dateTimeFormat = new Intl.DateTimeFormat('en', dateOptions);
        list.forEach((item, index) => {
            if (index % 4 !== 0) {
                return;
            }

            const date = new Date(item.dt * 1000);
            const th = createDomNode('th', dateTimeFormat.format(date));
            th.setAttribute('scope', 'col');
            headRow.appendChild(th);
            const { main = {}, weather = [{}] } = item;
            const wc = createDomNode('td');
            renderWeatherCondition(weather[0], wc);
            condition.appendChild(wc);
            temperature.appendChild(createDomNode('td', formatTemperature(main.temp)));
            humidity.appendChild(createDomNode('td', formatHumidity(main.humidity)));
        });

        forecast.appendChild(table);
        show(forecast);
    }

    function renderWeatherCondition(weatherCondition, wrapperElement) {
        const { description, icon } = weatherCondition;
        if (description) {
            if (icon) {
                const figure = document.createElement('figure');
                const caption = createDomNode('figcaption', description);

                const img = new Image();
                img.src = `https://openweathermap.org/img/wn/${icon}.png`;
                img.alt = description;
                img.setAttribute('aria-hidden', true);
                figure.appendChild(img);
                figure.appendChild(caption);
                wrapperElement.appendChild(figure);
            }
            else {
                wrapperElement.textContent = description;
            }
        }
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
        return isNaN(temperature) ? '' : `${Math.round(temperature)}\u00B0C`;
    }

    function formatHumidity(humidity) {
        return isNaN(humidity) ? '' : `${humidity}%`;
    }

    function hide(element) {
        element.setAttribute('hidden', 'hidden');
        element.setAttribute('aria-hidden', true);

    }

    function show(element) {
        element.removeAttribute('hidden');
        element.setAttribute('aria-hidden', false);
    }
})();


