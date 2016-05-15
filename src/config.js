export default {
  duration: 750,
  ease: 'linear',
  delay: function(d, i) {
    return i * 50;
  },
  height: 300,
  invertOrientation: false,
  padding: {left: 0, bottom: 0},
  transition: void 0,
  width: 400,
  xAccessor: function(d) {
    return d.name;
  },
  xDomain: void 0,
  xScale: void 0,
  yAccessor: function(d) {
    return d.value;
  },
  yDomain: void 0,
  yScale: void 0,
}
