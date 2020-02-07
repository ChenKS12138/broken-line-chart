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
  const POINT_SIZE = pointSize;
  context.fillStyle = color;
  const { x, y } = position;
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
  const [firstPosition, ...restPositions] = positions;
  context.strokeStyle = color;
  context.lineWidth = lineWidth;
  context.lineCap = 'round';
  context.lineJoin = 'round';
  context.beginPath();
  context.moveTo(firstPosition.x, firstPosition.y);
  restPositions.forEach(position => context.lineTo(position.x, position.y));
  context.stroke();
}

/**
 * 
 * @param {CanvasRenderingContext2D} context 
 * @param {PointPosition} position 
 * @param {String} text 
 * @param {String} textColor 
 */
function drawText(context, position, text, textColor,offset=0) {
  context.fillStyle = textColor;
  context.font = "10px";
  const { x, y } = position;
  context.fillText(text, x, y-10);
}

/**
 * @param {Array<Point>} points 
 * @return {Array<Point>}
 */
function setPosition(points) {
  const length = points.length;
  const gap = 1 / (length * 2);
  return points.map((point, index) => {
    const { value } = point;
    point.position = { x: (index * 2 + 1) * gap, y: value };
    return point;
  })
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
  const context = CanvasElement.getContext("2d");
  window.context = context;
  const { width: rawWidth, height: rawHeight } = size;
  CanvasElement.width = rawWidth;
  CanvasElement.height = rawHeight;
  CanvasElement.style.width = rawWidth;
  CanvasElement.style.height = rawHeight;
  const width = rawWidth / window.devicePixelRatio;
  const height = rawHeight / window.devicePixelRatio;
  context.setTransform(window.devicePixelRatio, 0, 0, window.devicePixelRatio, 0,0);
  
  const percentageIncreasement = current => 1 * current - current * current;
  

  const render = (percentage = 0.1, count=0) => {
    context.clearRect(0, 0, width, height);
    for (const axia of axias) {
      const { pointColor, lineColor, data, lineWidth, pointSize, textColor } = axia;
      const currentData = JSON.parse(JSON.stringify(data)); //这边处理得不太好
      currentData.forEach(x => x.value = (1 - x.value*percentage));

      const dataWithPosition = setPosition(currentData);
      dataWithPosition.forEach(item => positionAmplifier(item.position, width, height));
      const positions = dataWithPosition.map(x => x.position);
      drawLine(context, positions, lineColor, lineWidth);
      dataWithPosition.forEach(item => {
        drawPoint(context, item.position, pointColor, pointSize);
        drawText(context, item.position, item.text, textColor,item.offset);
      });
    }
    if (percentage <= 1 && count < 300) {
      requestAnimationFrame(() => render(percentage + 0.1 * percentageIncreasement(percentage),count+1));
    }
  }
  render(0.1,Infinity);
  return function () {
    render(0.1);
  }
}
