import * as uuid from "uuid/v4";

export class Emitter<T> {
  _uuid = uuid();

  _target = new EventTarget();

  emit(data: T) {
    this._target.dispatchEvent(
      new CustomEvent(this._uuid, { detail: { ...data } })
    );
  }

  get event() {
    return (callback: Function) => {
      const wrapper = (e: CustomEvent<T>): void => callback(e.detail);

      this._target.addEventListener(this._uuid, wrapper as EventListener);

      return this._target.removeEventListener.bind(
        this._target,
        this._uuid,
        wrapper as EventListener
      );
    };
  }
}
