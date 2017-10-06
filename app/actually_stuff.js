// const Hello = () => {
//   return <span className={'big-and-pretty'}>Hello webcamp!</span>;
// }

const Hello = () => {
  return createElement('span', {className: 'big-and-pretty' }, [`Hello Webcamp!`]);
}
