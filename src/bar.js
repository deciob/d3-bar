import {
  scaleBand,
  scaleLinear,
} from '../node_modules/d3-scale/index';

import configuration from './config';
import {
  extend,
  getDomain,
  getXRange,
  getYRange,
  getSet,
} from './helpers';


export default function (_config) {
  var config = extend((_config || {}), configuration);

  function exports(selection) {
    var data = selection.datum();
    var invertOrientation = config.invertOrientation;
    // check for data.
    var xDomain = config.xDomain || getDomain('ordinal', config.xAccessor, data);
    var xScale = config.xScale || scaleBand()
        .rangeRound(getXRange(config), 0.1)
        .padding(0.1)
        .domain(xDomain);
    var yDomain = config.yDomain || getDomain('continuous', config.yAccessor, data);
    var yScale = config.yScale || scaleLinear()
        .rangeRound(getYRange(config))
        .domain(yDomain);
    var height = config.height - config.margin.top - config.margin.bottom;
    var width = config.width - config.margin.left - config.margin.right;

    getSet(exports, {xDomain: xDomain, xScale: xScale, yDomain: yDomain, yScale: yScale});

    var barG = selection.select('.bars-g');
    if (barG.empty()) {
      barG = selection.append('g')
        .attr('class', 'bars-g')
        .attr("transform", `translate(${config.margin.left},${config.margin.top})`);
    }

    var bars = barG
      .selectAll('.bar')
      .data(data, config.xAccessor);
    bars.exit()
      .remove();
    bars.enter()
      .append('rect')
        .attr('class', 'bar')
      .merge(bars).transition(config.transition)
        .attr('x', function(d) {
          if (invertOrientation) {
            // oxxxxxx
            // xxxxxxx
            //
            // oxxxxxx
            // xxxxxxx
            return config.padding.left;
          }
          // ox ox
          // xx xx
          // xx xx
          // xx xx
          return config.padding.left + xScale(config.xAccessor(d));
        })
        .attr('y', function(d) {
          if (invertOrientation) {
            return -(config.padding.bottom) + xScale(config.xAccessor(d));
          }
          return height - config.padding.bottom - yScale(config.yAccessor(d));
        })
        .attr('width', function(d) {
          if (invertOrientation) {
            return yScale(config.yAccessor(d));
          }
          return xScale.bandwidth();
        })
        .attr('height', function(d) {
          if (invertOrientation) {
            return xScale.bandwidth();
          }
          return yScale(config.yAccessor(d));
        })
        .delay(config.delay);
  }

  getSet(exports, config);

  exports.config = config;

  return exports;
}
