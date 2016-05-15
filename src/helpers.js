import {entries} from '../node_modules/d3-collection/index';
import {max} from '../node_modules/d3-array/index';

function inspect(x) {
  return (typeof x === 'function') ? inspectFn(x) : inspectArgs(x);
}

function inspectFn(f) {
  return (f.name) ? f.name : f.toString();
}

function inspectArgs(args) {
  return args.reduce(function(acc, x){
    return acc += inspect(x);
  }, '(') + ')';
}

export function curry(fx) {
  var arity = fx.length;

  return function f1() {
    var args = Array.prototype.slice.call(arguments, 0);
    if (args.length >= arity) {
      return fx.apply(null, args);
    }
    else {
      var f2 = function f2() {
        var args2 = Array.prototype.slice.call(arguments, 0);
        return f1.apply(null, args.concat(args2));
      }
      f2.toString = function() {
        return inspectFn(fx) + inspectArgs(args);
      }
      return f2;
    }
  };
}

// isObject :: a -> Bool
export function isObject(o) {
  return Object.prototype.toString.call(o) === '[object Object]';
}

// clone :: Object -> Object
export function clone(obj) {
  if (obj === null || typeof obj !== 'object') return obj;
  var copy = obj.constructor();
  for (var attr in obj) {
    if (obj.hasOwnProperty(attr)) {
      copy[attr] = clone(obj[attr]);
    }
  }
  return copy;
}

// extend target with source, clone by default
// extend :: Object -> Object -> Object -> Object
export function extend(target, source, options) {
  if (!isObject(target) || !isObject(source)) {
    throw new Error('extend only accepts objects');
  }
  var useClone = (!options || options.useClone === undefined) ? true : options.useClone;
  // notOverride (target) defaults to false.
  var notOverride = (options && options.notOverride === undefined || !options) ?
   false : options.notOverride;
  var targetClone = useClone ? clone(target) : target;
  for (var prop in source) {
    if (notOverride) {
      targetClone[prop] = targetClone[prop] ? targetClone[prop] : source[prop];
    } else {
      targetClone[prop] = source[prop];
    }
  }
  return targetClone;
}

// For each attribute in `state` it sets a getter-setter function on `obj`.
// Accepts one level nested `state` objects.
// getset :: a -> a
export function getSet(obj, state) {
  entries(state).forEach(function(o) {
    obj[o.key] = function getSetCallback(x) {
      if (!arguments.length) return state[o.key];
      if (isObject(o.value)) {
        state[o.key] = extend(o.value, x);
      } else {
        state[o.key] = x;
      }
      return obj;
    };
  });
  return obj;
}

// getRange :: String -> Object -> Array
export function getRange(axes, config) {
  if (axes === 'x') {
    return config.invertOrientation ? [0, config.height] : [0, config.width];
  } else if (axes = 'y') {
    return config.invertOrientation ? [0, config.width] : [0, config.height];
  }
}

function getContinousDomain(accessor, data) {
  return [0, max(data, accessor)];
}

function getOrdinalDomain(accessor, data) {
  return data.map(function(d) {
    return accessor(d);
  });
}

export function getDomain(scaleType, accessor, data) {
  if (scaleType === 'continuous') {
    return getContinousDomain(accessor, data);
  } else if (scaleType === 'ordinal') {
    return getOrdinalDomain(accessor, data);
  }
}

var getRangeCurried = curry(getRange);

export var getXRange = getRangeCurried('x');
export var getYRange = getRangeCurried('y');
