'use strict';

class WeatherIcon extends HTMLElement {
  constructor() {
    super();

    const templateContent = document.querySelector('#t-weather-icon').content;
    this.attachShadow({ mode: 'open' }).appendChild(templateContent.cloneNode(true));
  }

  connectedCallback() {
    this.shadowRoot.querySelector('figcaption').innerText = this.getAttribute('description');
    const icon = this.getAttribute('icon');
    this.shadowRoot.querySelector('img').setAttribute('src', `https://openweathermap.org/img/wn/${icon}.png`);
  }
}

customElements.define("weather-icon", WeatherIcon);

export function renderWeatherCondition(weatherCondition, wrapperElement) {
  const { description, icon } = weatherCondition;
  if (!description) {
    return;
  }
  if (icon) {
    wrapperElement.innerHTML = `<weather-icon description="${description}" icon="${icon}"></weather-icon>`
  } else {
    wrapperElement.textContent = description;
  }
}
