"use strict";

function _toArray(arr) { return _arrayWithHoles(arr) || _iterableToArray(arr) || _nonIterableRest(); }

function _nonIterableRest() { throw new TypeError("Invalid attempt to destructure non-iterable instance"); }

function _iterableToArray(iter) { if (Symbol.iterator in Object(iter) || Object.prototype.toString.call(iter) === "[object Arguments]") return Array.from(iter); }

function _arrayWithHoles(arr) { if (Array.isArray(arr)) return arr; }

/**
 * @typedef {Object} PointPosition 位置
 * @property {Number} x 取值范围是0~1
 * @property {Number} y 取值范围是0~1
 */

/**
 * @typedef {Object} Point 一个点
 * @property {Number} value 该点在y轴的高度，取值0~1
 * @property {String} text 点的文字
 * @property {Number} offset 文字与点的y轴偏移量
 * @property {PointPosition=} position
 */

/**
 * @typedef {Object} Axia 一个轴的数据
 * @property {String} lineColor 线的颜色
 * @property {Array<Point>} data 轴的值
 * @property {String} textColor 文字的颜色
 * @property {Number} pointSize 点大小
 * @property {Number} lineWidth 线宽度
 * @property {String} pointColor 点的颜色
 */

/**
  * @typedef {Object} Size
  * @property {Number} width
  * @property {Number} height
  */

/** 
 * @typedef {Array<Axia>} AxiaList 所有轴的数据
 */

/**
 * @param {CanvasRenderingContext2D} context 
 * @param {PointPosition} position 
 * @param {String} color 
 * @param {Number} pointSize
 */
function drawPoint(context, position, color, pointSize) {
  var POINT_SIZE = pointSize;
  context.fillStyle = color;
  var x = position.x,
      y = position.y;
  context.beginPath();
  context.arc(x, y, POINT_SIZE, 0, 360);
  context.closePath();
  context.fill();
}
/**
 * @param {CanvasRenderingContext2D} context 
 * @param {Array<PointPosition>} positions
 * @param {String} color 
 * @param {Number} lineWidth 
 */


function drawLine(context, positions, color, lineWidth) {
  var _positions = _toArray(positions),
      firstPosition = _positions[0],
      restPositions = _positions.slice(1);

  context.strokeStyle = color;
  context.lineWidth = lineWidth;
  context.lineCap = 'round';
  context.lineJoin = 'round';
  context.beginPath();
  context.moveTo(firstPosition.x, firstPosition.y);
  restPositions.forEach(function (position) {
    return context.lineTo(position.x, position.y);
  });
  context.stroke();
}
/**
 * 
 * @param {CanvasRenderingContext2D} context 
 * @param {PointPosition} position 
 * @param {String} text 
 * @param {String} textColor 
 */


function drawText(context, position, text, textColor) {
  var offset = arguments.length > 4 && arguments[4] !== undefined ? arguments[4] : 0;
  context.fillStyle = textColor;
  context.font = "10px";
  var x = position.x,
      y = position.y;
  context.fillText(text, x, y - 10);
}
/**
 * @param {Array<Point>} points 
 * @return {Array<Point>}
 */


function setPosition(points) {
  var length = points.length;
  var gap = 1 / (length * 2);
  return points.map(function (point, index) {
    var value = point.value;
    point.position = {
      x: (index * 2 + 1) * gap,
      y: value
    };
    return point;
  });
}
/**
 * @param {PointPosition} position 
 * @param {Number} width 
 * @param {Number} heigth 
 * @returns {void}
 */


function positionAmplifier(position, width, heigth) {
  position.x *= width;
  position.y *= heigth;
}
/**
 * @param {HTMLElement} CanvasElement 
 * @param {AxiaList} axias
 * @param {Size} size
 * @returns {Function} 展示数据
 */


function borkenLineChart(CanvasElement, size, axias) {
  /**
   * @type {CanvasRenderingContext2D}
   */
  var context = CanvasElement.getContext("2d");
  window.context = context;
  var rawWidth = size.width,
      rawHeight = size.height;
  CanvasElement.width = rawWidth;
  CanvasElement.height = rawHeight;
  CanvasElement.style.width = rawWidth;
  CanvasElement.style.height = rawHeight;
  var width = rawWidth / window.devicePixelRatio;
  var height = rawHeight / window.devicePixelRatio;
  context.setTransform(window.devicePixelRatio, 0, 0, window.devicePixelRatio, 0, 0);

  var percentageIncreasement = function percentageIncreasement(current) {
    return 1 * current - current * current;
  };

  var render = function render() {
    var percentage = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 0.1;
    var count = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 0;
    context.clearRect(0, 0, width, height);
    var _iteratorNormalCompletion = true;
    var _didIteratorError = false;
    var _iteratorError = undefined;

    try {
      var _loop = function _loop() {
        var axia = _step.value;
        var pointColor = axia.pointColor,
            lineColor = axia.lineColor,
            data = axia.data,
            lineWidth = axia.lineWidth,
            pointSize = axia.pointSize,
            textColor = axia.textColor;
        var currentData = JSON.parse(JSON.stringify(data)); //这边处理得不太好

        currentData.forEach(function (x) {
          return x.value = 1 - x.value * percentage;
        });
        var dataWithPosition = setPosition(currentData);
        dataWithPosition.forEach(function (item) {
          return positionAmplifier(item.position, width, height);
        });
        var positions = dataWithPosition.map(function (x) {
          return x.position;
        });
        drawLine(context, positions, lineColor, lineWidth);
        dataWithPosition.forEach(function (item) {
          drawPoint(context, item.position, pointColor, pointSize);
          drawText(context, item.position, item.text, textColor, item.offset);
        });
      };

      for (var _iterator = axias[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
        _loop();
      }
    } catch (err) {
      _didIteratorError = true;
      _iteratorError = err;
    } finally {
      try {
        if (!_iteratorNormalCompletion && _iterator["return"] != null) {
          _iterator["return"]();
        }
      } finally {
        if (_didIteratorError) {
          throw _iteratorError;
        }
      }
    }

    if (percentage <= 1 && count < 300) {
      requestAnimationFrame(function () {
        return render(percentage + 0.1 * percentageIncreasement(percentage), count + 1);
      });
    }
  };

  render(0.1, Infinity);
  return function () {
    render(0.1);
  };
}
