import { Emitter } from "../lib/event";
import { observable, action } from "mobx";

export class Keyboard {
  constructor(store) {
    this.store = store;
    this._setupListeners();
  }

  /**
   * Handles keyboard down when target is any of the dedicated midi keys.
   *
   * Q W E R T Y
   * A S D F G H
   */
  _onMIDILayoutDown = new Emitter();
  onMIDILayoutDown = this._onMIDILayoutDown.event;

  /**
   * Handles keyboard up when target is any of the dedicated midi keys.
   *
   * Q W E R T Y
   * A S D F G H
   */
  _onMIDILayoutUp = new Emitter();
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
          return this._onMIDILayoutDown.emit({ note: "C4" });
        case "s":
          return this._onMIDILayoutDown.emit({ note: "D4" });
        case "d":
          return this._onMIDILayoutDown.emit({ note: "E4" });
        case "f":
          return this._onMIDILayoutDown.emit({ note: "F4" });
        case "g":
          return this._onMIDILayoutDown.emit({ note: "G4" });
        case "h":
          return this._onMIDILayoutDown.emit({ note: "A4" });
        case "j":
          return this._onMIDILayoutDown.emit({ note: "B4" });
      }
    });

    document.addEventListener("keyup", event => {
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
          return this._onMIDILayoutUp.emit({ note: "C4" });
        case "s":
          return this._onMIDILayoutUp.emit({ note: "D4" });
        case "d":
          return this._onMIDILayoutUp.emit({ note: "E4" });
        case "f":
          return this._onMIDILayoutUp.emit({ note: "F4" });
        case "g":
          return this._onMIDILayoutUp.emit({ note: "G4" });
        case "h":
          return this._onMIDILayoutUp.emit({ note: "A4" });
        case "j":
          return this._onMIDILayoutUp.emit({ note: "B4" });
      }
    });
  };
}
