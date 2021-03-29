export default class Event {
  constructor() {
    this._listeners = {};
  }

  /* 注册监听事件
   * @param {String} type 监听的事件类型
   * @param {Function} handler 事件处理程序
   */
  on(type, handler) {
    if (!this._listeners[type]) this._listeners[type] = [];
    this._listeners[type] = [...new Set([...this._listeners[type], handler])];
  }

  /* 触发事件
   * @param {String} type 触发的事件类型
   * @param {Object} event 事件对象
   */
  emit(type, event) {
    if (!type) return;
    const listeners = this._listeners[type];
    if (!listeners || !listeners.length) return;
    listeners.forEach((handler) => {
      handler.apply(this, [event]);
    });
  }

  /* 移除事件
   * @param {String} type 移除的事件类型
   * @param {Function} handler 移除的事件
   * @return {Array} 移除相关事件后的事件集合
   */
  remove(type, handler) {
    if (!type) return;
    if (!handler) this._listeners[type] = [];
    return this._listeners[type].filters((item) => {
      return item !== handler;
    });
  }
}
