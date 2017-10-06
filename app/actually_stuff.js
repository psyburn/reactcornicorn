function createElement(type, props = {}, children = []) {
  const el = document.createElement(type);

  Object.keys(props).forEach((propKey) => {
    el[propKey] = props[propKey];
  })

  children.forEach((item) => {
    el.innerHTML += item;
  });

  return el;
}

function render(el, rootEl) {
  rootEl.appendChild(el);
}

const Hello = () => {
  return createElement('span', {className: 'big-and-pretty' }, [`Hello Webcamp!`]);
}

render(Hello(), document.getElementById('root'));
