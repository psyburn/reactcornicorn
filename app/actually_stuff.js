function createVInstance(vElement) {
  const { type, props } = vElement;
  const { children } = props;

  let el;
  if (typeof type === 'function') {
    const comp = new type(props);
    const vComEl = comp.render();
    const comVInstance = createVInstance(vComEl);
    el = comVInstance.el;

  } else {
    if (type === 'TEXT') {
      el = document.createTextNode('');
    } else {
      el = document.createElement(type);
    }
  }

  updateProps(el, [], props);

  const childVInstances = children.map(createVInstance);
  childVInstances.forEach((child) => el.appendChild(child.el));

  return {
    el,
    vElement,
    childVInstances,
  };
}


const updateProps = (el, prevProps, nextProps) => {
  const nextKeys = Object.keys(nextProps) || [];
  const prevKeys = Object.keys(prevProps) || [];
  const getEventName = (item) => (item.toLowerCase().substring(2));
  const isEventListener = (item) => (item.indexOf('on') === 0);

  prevKeys.filter(isEventListener).forEach((propKey) => {
    const eventName = getEventName(propKey);
    el.removeEventListener(eventName, prevProps[propKey])
  });

  nextKeys.filter(isEventListener).forEach((propKey) => {
    const eventName = getEventName(propKey);
    el.addEventListener(eventName, nextProps[propKey]);
  });

  const isRealProp = (item) => !isEventListener(item) && item !== 'children';

  prevKeys.filter(isRealProp).forEach((propKey) => {
    el[propKey] = undefined;
  });

  nextKeys.filter(isRealProp).forEach((propKey) => {
    el[propKey] = nextProps[propKey];
  })
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
    },
  }
}

let mainVInstance;

function render(vEl, rootEl) {
  const previousVInstance = mainVInstance;
  const nextInstance = beSmart(previousVInstance, vEl, rootEl);
  mainVInstance = nextInstance;
}

const beSmart = (currentVInstance, vEl, rootEl) => {
  const newInstance = createVInstance(vEl);
  if (!currentVInstance) {
    rootEl.appendChild(newInstance.el);
    return newInstance
  } else if (currentVInstance.vElement.type === newInstance.vElement.type) {
    updateProps(currentVInstance.el, currentVInstance.vElement.props, vEl.props);
    currentVInstance.vElement = vEl;
    return currentVInstance;
  } else {
    rootEl.replaceChild(newInstance.el, currentVInstance.el);
    return newInstance;
  }
};

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
