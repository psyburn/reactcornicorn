function createElement(type, props = {}, children = []) {
  const el = document.createElement(type);

  Object.keys(props).forEach((propKey) => {
    el[propKey] = props[propKey];
  })

  children.forEach((item) => {
    if (typeof item === 'string') {
      el.innerHTML += item;
    } else {
      el.appendChild(item);
    }
  });

  return el;
}

function render(el, rootEl) {
  rootEl.appendChild(el);
}

const ListOfStuff = () => {
  return createElement('div', undefined, [
    createElement('h1', undefined, ['Wonderful world of unicorns!']),
    createElement('img', { src: '/assets/images/batman-unicorn.jpg'}, undefined),
    createElement('img', { src: '/assets/images/faticorn.jpg' }, undefined),
  ]);
}

render(ListOfStuff(), document.getElementById('root'));
