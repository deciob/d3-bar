var tape = require('tape');

var module = require('../');

tape('clone() should create a deep copy of an object.', function(test) {
  var clone = module.clone;
  var obj = {foo: 1, bar: [1, 2, 3]};
  var clonedObj = clone(obj);

  test.deepEqual(obj, clonedObj, 'are cloned objects');

  clonedObj.bar.push(4);
  test.true(clonedObj.bar.length === 4, 'clonedObj has changed');
  test.true(obj.bar.length === 3, 'without affecting obj');
  test.end();
});

tape('extend() should extend target with source and return a new Object.', function(test) {
  var extend = module.extend;
  var target = {top: 5, left: 35, right: 5, bottom: 30};
  var sourceA = {top: 0, left: 5, right: 5, bottom: 0};
  var sourceB = {top: 1, left: 25};

  test.deepEqual(
    extend(target, sourceA),
    sourceA,
    'target has been extended with sourceA'
  );

  test.true(target.top === 5, 'without affecting the original target Object');

  test.deepEqual(
    extend(target, sourceB),
    {top: 1, left: 25, right: 5, bottom: 30},
    'target has been extended with sourceB'
  );

  test.true(target.left === 35, 'without affecting the original target Object');

  test.end();
});

tape('getSet() should get-set the correct options from config to f', function(test) {
  var getSet = module.getSet;
  var f = function() {};
  var config = {
    width: 200,
    margin: {top: 0, right: 0, bottom: 0, left: 0},
    padding: {bottom: 30, left: 30},
  };

  f = getSet(f, config);

  test.equal(f.width(), 200, 'gets a property on f');
  test.deepEqual(f.padding(), config.padding, 'gets a property on f');

  f.width(400);
  test.equal(f.width(), 400, 'sets a property on f');

  f.padding({left: 35});
  test.deepEqual(f.padding(), {bottom: 30, left: 35}, 'sets a nested property on f');

  test.end();
});

tape('getRange() should return a range depending on the axes and the orientation',
function(test) {
  var getRange = module.getRange;
  var config = {
    invertOrientation: false,
    height: 100,
    margin: {top: 0, right: 0, bottom: 0, left: 0},
    width: 200,
  };

  test.deepEqual(getRange('x', config), [0, 200], 'x range is [0, width]');
  test.deepEqual(getRange('y', config), [0, 100], 'y range is [0, height]');

  config.invertOrientation = true;

  test.deepEqual(getRange('x', config), [0, 100],
   'x range with inverted orientation is [0, height]');
  test.deepEqual(getRange('y', config), [0, 200],
   'y range with inverted orientation is [0, width]');

  test.end();
});

tape('getDomain() should return the data domain, depending on the scale', function(test) {
  var data = [['a', 5], ['b', 10], ['c', 1]];
  var xAccessor = function(d) {
    return d[0];
  };
  var xDomain = module.getDomain('ordinal', xAccessor, data);
  var yAccessor = function(d) {
    return d[1];
  };
  var yDomain = module.getDomain('continuous', yAccessor, data);

  test.deepEqual(xDomain, ['a', 'b', 'c']);
  test.deepEqual(yDomain, [0, 10]);
  test.end();
});
