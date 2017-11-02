const getPageY = (el) => {
  let offsetParent = el.offsetParent;
  let y = el.offsetTop;

  while (offsetParent) {
    y += offsetParent.offsetTop;
    offsetParent = offsetParent.offsetParent;
  }

  return y;
};

export default getPageY;
