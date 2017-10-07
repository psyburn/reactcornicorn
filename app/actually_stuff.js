function createElement(vElement) {
  const { type, props } = vElement;
  const { children } = props;

  let el;
  if (typeof type === 'function') {
    const comp = new type(props);
    const vComEl = comp.render();
    el = createElement(vComEl);
  } else {
    if (type === 'TEXT') {
      el = document.createTextNode('');
    } else {
      el = document.createElement(type);
    }
  }

  const keys =  Object.keys(props) || [];

  const isEventListener = (item) => (item.indexOf('on') === 0);
  keys.filter(isEventListener).forEach((propKey) => {
    const eventName = propKey.toLowerCase().substring(2);
    el.addEventListener(eventName, props[propKey]);
  });

  // we don't want to add the event listeners as props
  const isRealProp = (item) => !isEventListener(item) && item !== 'children';
  keys.filter(isRealProp).forEach((propKey) => {
    el[propKey] = props[propKey];
  })

  children.forEach((child) => el.appendChild(createElement(child)));

  return el;
}

function createText(val) {
  return createVElement('TEXT', { nodeValue: val });
}

function createVElement(type, props = {}, children = []) {
  const parsedChildren = children.map((child) => (typeof child === 'string' ? createText(child) : child));
  return {
    type,
    props: {
      ...props,
      children: parsedChildren,
    }
  }
}

function render(vEl, rootEl) {
  const el = createElement(vEl);
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

    return createVElement('div', {className: 'image-counter'}, [
      createVElement('img', {src, onClick: this.onClickHandler.bind(this)}, undefined),
      createVElement('h1', undefined, [`Corn click: ${counter}`])
    ]);
  }
}

class ListOfStuff extends Component {
  render() {
    return createVElement('div', undefined, [
      createVElement('h1', undefined, ['Wonderful world of unicorns!']),
      createVElement(ImageCounter, { src: '/assets/images/batman-unicorn.jpg', counter: 0}, undefined),
      createVElement(ImageCounter, { src: '/assets/images/faticorn.jpg', counter: 0}, undefined),
    ]);
  }
}

render(createVElement(ListOfStuff, undefined, undefined), document.getElementById('root'));
