'use strict';

import * as du from './domutils.js';

function createImage(icon, alt) {
  const img = new Image();
  img.src = `https://openweathermap.org/img/wn/${icon}.png`;
  img.alt = alt;
  img.setAttribute('aria-hidden', true);
  return img;
}

function createFigure(description, icon) {
  const caption = du.createDomNode('figcaption', description);
  const img = createImage(icon, description);

  return du.createDomNode('figure', img, caption);
}

export function renderWeatherCondition(weatherCondition, wrapperElement) {
  const {description, icon} = weatherCondition;
  if (!description) {
    return;
  }
  if (icon) {
    const figure = createFigure(description, icon);
    wrapperElement.appendChild(figure);
  } else {
    wrapperElement.textContent = description;
  }
}
