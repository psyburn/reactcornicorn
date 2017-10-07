function createVInstance(vElement) {
  const { type, props } = vElement;
  const { children } = props;

  let el;
  if (typeof type === 'function') {
    const selfVinstance = {};
    const comp = new type(props);
    comp._selfVInstance = selfVinstance;
    const vComEl = comp.render();
    const comVInstance = createVInstance(vComEl);
    el = comVInstance.el;
    Object.assign(selfVinstance, {
      el,
      vElement,
      childVInstance: comVInstance,
      component: comp,
    });
    return selfVinstance;
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
  if (!currentVInstance) {
    const newInstance = createVInstance(vEl);
    rootEl.appendChild(newInstance.el);
    return newInstance;
  } else if (!vEl) {
    rootEl.removeChild(currentVInstance.el);
    return;
  } else if (currentVInstance.component) {
    currentVInstance.component.props = vEl.props;
    const childElement = currentVInstance.component.render();
    const oldChildInstance = currentVInstance.childVInstance;
    const childInstance = beSmart(oldChildInstance, childElement, rootEl);
    currentVInstance.el = childInstance.el;
    currentVInstance.childVInstance = childInstance;
    currentVInstance.vElement = vEl;
    return currentVInstance;
  } else if (typeof currentVInstance.vElement.type === 'string') {
    updateProps(currentVInstance.el, currentVInstance.vElement.props, vEl.props);
    currentVInstance.childVInstances = beSmartWithChildren(currentVInstance, vEl);
    currentVInstance.vElement = vEl;
    return currentVInstance;
  } else {
    const newInstance = createVInstance(vEl);
    rootEl.replaceChild(newInstance.el, currentVInstance.el);
    return newInstance;
  };
};

const beSmartWithChildren = (currentVInstance, vEl) => {
  const childVInstances = currentVInstance.childVInstances;
  const nextChildVElements = vEl.props.children || [];
  const newChildVInstances = [];
  const len = Math.max(childVInstances.length, nextChildVElements.length);
  for (let i = 0; i < len; i++) {
    const childVInstance = childVInstances[i];
    const childVElement = nextChildVElements[i];
    const newChildVInstance = beSmart(childVInstance, childVElement, currentVInstance.el);
    newChildVInstances.push(newChildVInstance);
  }
  return newChildVInstances;
};


class Component {
  constructor(props) {
    this.props = props;
    this.state = {};
  }

  setState(update) {
    this.state = Object.assign({}, this.state, update);
    beSmart(this._selfVInstance, this._selfVInstance.vElement, this._selfVInstance.el.parentNode);
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
