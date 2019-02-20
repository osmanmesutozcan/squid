import { observable, action } from "mobx";
import { Emitter } from "../lib/event";
import { IMIDIKeyEvent } from "../lib/keyboard";

import { Root } from "./root.store";

export class Keyboard {
  store: typeof Root;

  constructor(store: typeof Root) {
    this.store = store;
    this._setupListeners();
  }

  /**
   * Handles keyboard down when target is any of the dedicated midi keys.
   *
   * Q W E R T Y
   * A S D F G H
   */
  _onMIDILayoutDown = new Emitter<IMIDIKeyEvent>();
  onMIDILayoutDown = this._onMIDILayoutDown.event;

  /**
   * Handles keyboard up when target is any of the dedicated midi keys.
   *
   * Q W E R T Y
   * A S D F G H
   */
  _onMIDILayoutUp = new Emitter<IMIDIKeyEvent>();
  onMIDILayoutUp = this._onMIDILayoutUp.event;

  /**
   * Currently unit which is permitted to react to the keyboard events.
   * This is nothing but a convinience property.
   */
  @observable
  _boundUnit = undefined;
  get boundUnit() {
    return this._boundUnit;
  }
  @action.bound
  set boundUnit(uuid) {
    this._boundUnit = uuid;
  }

  // TODO: We should get these notes from a music theory library.
  _setupListeners = () => {
    document.addEventListener("keydown", event => {
      const ev = (note: string): IMIDIKeyEvent => ({ type: "down", note });

      // eslint-disable-next-line default-case
      switch (event.key) {
        case "q":
        case "w":
        case "e":
        case "r":
        case "t":
        case "y":
          return;

        case "a":
          return this._onMIDILayoutDown.emit(ev("C4"));
        case "s":
          return this._onMIDILayoutDown.emit(ev("D4"));
        case "d":
          return this._onMIDILayoutDown.emit(ev("E4"));
        case "f":
          return this._onMIDILayoutDown.emit(ev("F4"));
        case "g":
          return this._onMIDILayoutDown.emit(ev("G4"));
        case "h":
          return this._onMIDILayoutDown.emit(ev("A4"));
        case "j":
          return this._onMIDILayoutDown.emit(ev("B4"));
      }
    });

    document.addEventListener("keyup", event => {
      const ev = (note: string): IMIDIKeyEvent => ({ type: "up", note });

      // eslint-disable-next-line default-case
      switch (event.key) {
        case "q":
        case "w":
        case "e":
        case "r":
        case "t":
        case "y":
          return;

        case "a":
          return this._onMIDILayoutUp.emit(ev("C4"));
        case "s":
          return this._onMIDILayoutUp.emit(ev("D4"));
        case "d":
          return this._onMIDILayoutUp.emit(ev("E4"));
        case "f":
          return this._onMIDILayoutUp.emit(ev("F4"));
        case "g":
          return this._onMIDILayoutUp.emit(ev("G4"));
        case "h":
          return this._onMIDILayoutUp.emit(ev("A4"));
        case "j":
          return this._onMIDILayoutUp.emit(ev("B4"));
      }
    });
  };
}
