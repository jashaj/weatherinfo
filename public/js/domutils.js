'use strict';

function setChildNodes(el, children) {
  if (children.length === 1 && typeof children[0] === 'string') {
    el.textContent = children[0];
    return;
  }
  children.forEach(child => el.appendChild(child));
}

export function createDomNode(elementName, ...children) {
  const el = document.createElement(elementName);
  if (children.length > 0) {
    setChildNodes(el, children);
  }
  return el;
}

export function hide(element) {
  element.setAttribute('hidden', 'hidden');
  element.setAttribute('aria-hidden', true);
}

export function show(element) {
  element.removeAttribute('hidden');
  element.setAttribute('aria-hidden', false);
}
