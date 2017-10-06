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

  setState(update) {
    this.state = Object.assign({}, this.state, update);
  }

  render() {
    console.warn('you should really implement this');
  }
}

class ImageCounter extends Component {
  constructor(props) {
    super(props);

    this.state = {
      counter: props.counter,
    }
  }

  render() {
    const { src } = this.props;
    const { counter } = this.state;

    return createElement('div', {className: 'image-counter'}, [
      createElement('img', {src}, undefined),
      createElement('h1', undefined, [`Corn click: ${counter}`])
    ]);
  }
}

class ListOfStuff extends Component {
  render() {
    return createElement('div', undefined, [
      createElement('h1', undefined, ['Wonderful world of unicorns!']),
      createElement(ImageCounter, { src: '/assets/images/batman-unicorn.jpg', counter: 0}, undefined),
      createElement(ImageCounter, { src: '/assets/images/faticorn.jpg', counter: 0}, undefined),
    ]);
  }
}

render(createElement(ListOfStuff, undefined, undefined), document.getElementById('root'));
