const getPageX = (el) => {
  let offsetParent = el.offsetParent;
  let x = el.offsetLeft;

  while (offsetParent) {
    x += offsetParent.offsetLeft;
    offsetParent = offsetParent.offsetParent;
  }

  return x;
}

export default getPageX;
