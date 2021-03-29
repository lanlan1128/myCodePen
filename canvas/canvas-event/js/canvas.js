import Event from "./event.js";

/* 矩形类 */
export class Rect extends Event {
  constructor(canvas, opt) {
    super(arguments);

    this.canvas = canvas;
    this.config = opt;
  }

  draw() {
    const { canvas, config } = this;
    const ctx = canvas.getContext("2d");
    const { x, y, width, height, color } = config;
    ctx.fillStyle = color;
    ctx.fillRect(x, y, width, height);
  }

  /* 判断事件的触发坐标是否在矩形框内
   * @param {Number} clientX 事件相对视口的x轴坐标
   * @param {Number} clientY 事件相对视口的y轴坐标
   */
  isEventInRect(clientX, clientY) {
    const point = this._getCanvasPosition(clientX, clientY);
    const { x, y, width, height } = this.config;
    if (
      x < point.x &&
      point.x < x + width &&
      y < point.y &&
      point.y < y + height
    ) {
      return true;
    }
    return false;
  }

  /* 获取事件的触发坐标相对canvas的坐标
   * @param {Number} clientX 事件相对视口的x轴坐标
   * @param {Number} clientY 事件相对视口的y轴坐标
   */
  _getCanvasPosition(clientX, clientY) {
    const position = this.canvas.getBoundingClientRect(); // 获取的是border-box的盒子大小和这个盒子相对视口的位置
    const canvasStyle = this._getStyle(this.canvas);
    return {
      x:
        clientX -
        position.x -
        parseInt(canvasStyle.borderLeftWidth) -
        parseInt(canvasStyle.paddingLeft),
      y:
        clientY -
        position.y -
        parseInt(canvasStyle.borderTopWidth) -
        parseInt(canvasStyle.paddingTop),
    };
  }

  _getStyle(el) {
    if (getComputedStyle) {
      return getComputedStyle(el);
    } else {
      return el.currentStyle;
    }
  }
}

/* canvas类 */
export class Canvas {
  constructor(canvas) {
    this.canvas = canvas;
    this._children = [];

    this.addRect({
      x: 20,
      y: 20,
      width: 100,
      height: 100,
      color: "purple",
    });
    this.draw();
    this.initEvent(function (event) {
      console.log(event);
    });
  }

  initEvent(handler) {
    const eventList = ["click", "mousemove"];
    // const eventList = ["click"];
    eventList.forEach((eventName) => {
      this.addChildEvent(eventName, handler);
      this.canvas.addEventListener(
        eventName,
        (event) =>
          this._children.map((shape) => {
            if (shape.isEventInRect(event.x, event.y))
              shape.emit(eventName, event);
          }),
        false
      );
    });
  }

  addChildEvent(eventName, handler) {
    this._children.map((shape) => shape.on(eventName, handler));
  }

  addRect(opt) {
    const rect = new Rect(this.canvas, opt);
    this.addChild(rect);
  }

  addChild(shape) {
    this._children.push(shape);
  }

  draw() {
    this._children.forEach((shape) => shape.draw());
  }
}
