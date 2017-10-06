function createElement(type, props = {}, children = []) {
  let el;
  if (typeof type === 'function') {
    const comp = new type(props);
    el = comp.render();
  } else {
    el = document.createElement(type);
  }

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

class Component {
  constructor(props) {
    this.props = props;
  }

  render() {
    console.warn('you should really implement this');
  }
}

class ListOfStuff extends Component {
  render() {
    return createElement('div', undefined, [
      createElement('h1', undefined, ['Wonderful world of unicorns!']),
      createElement('img', { src: '/assets/images/batman-unicorn.jpg'}, undefined),
      createElement('img', { src: '/assets/images/faticorn.jpg'}, undefined),
    ]);
  }
}

// render(<ListOfStuff />, document.getElementById('root'));
render(createElement(ListOfStuff, undefined, undefined), document.getElementById('root'));
