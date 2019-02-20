import uuid from "uuid/v4";

export class Emitter {
  _uuid = uuid();

  _target = new EventTarget();

  emit(data) {
    this._target.dispatchEvent(
      new CustomEvent(this._uuid, { detail: { ...data } })
    );
  }

  get event() {
    return callback => {
      const wrapper = e => callback(e.detail);

      this._target.addEventListener(this._uuid, wrapper);

      return this._target.removeEventListener.bind(
        this._target,
        this._uuid,
        wrapper
      );
    };
  }
}
