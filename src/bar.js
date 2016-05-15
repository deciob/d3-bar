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
    var xScale = config.xScale || scaleBand()
        .rangeRound(getXRange(config), 0.1)
        .padding(0.1)
        .domain(config.xDomain || getDomain('ordinal', config.xAccessor, data));
    var yScale = config.yScale || scaleLinear()
        .range(getYRange(config))
        .domain(config.yDomain || getDomain('continuous', config.yAccessor, data));

    var barG = selection.select('.bar-g');
    if (barG.empty()) {
      barG = selection.append('g')
        .attr('class', 'bars-g');
    }

    var bars = barG
      .selectAll('.bar')
      .data(data, config.xAccessor);
    bars.exit()
      .remove();
    bars.enter()
      .append('rect')
        .attr('class', 'bar')
      .merge(bars)//.transition(config.transition)
        .attr('x', function(d) {
          if (invertOrientation) {
            return config.padding.left;
          }
          return config.padding.left + xScale(config.xAccessor(d));
        })
        .attr('y', function(d) {
          if (invertOrientation) {
            return config.padding.left + xScale(config.xAccessor(d));
          }
          return config.height - config.padding.bottom - yScale(config.yAccessor(d));
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
        });
        //.delay(config.delay);
  }

  getSet(exports, config);

  exports.config = config;

  return exports;
}
