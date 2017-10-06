function createElement(type, props = {}, children = []) {
  let el;
  if (typeof type === 'function') {
    const comp = new type(props);
    el = comp.render();
  } else {
    el = document.createElement(type);
  }

  const keys =  Object.keys(props) || [];

  const isEventListener = (item) => (item.indexOf('on') === 0);
  keys.filter(isEventListener).forEach((propKey) => {
    const eventName = propKey.toLowerCase().substring(2);
    el.addEventListener(eventName, props[propKey]);
  });

  // we don't want to add the event listeners as props
  const isRealProp = (item) => !isEventListener(item);
  keys.filter(isRealProp).forEach((propKey) => {
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

  onClickHandler() {
    console.info('CLICKED ON A CORN!', this.state.counter);
    this.setState({
      counter: this.state.counter + 1,
    })
  }

  render() {
    const { src } = this.props;
    const { counter } = this.state;

    return createElement('div', {className: 'image-counter'}, [
      createElement('img', {src, onClick: this.onClickHandler.bind(this)}, undefined),
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
