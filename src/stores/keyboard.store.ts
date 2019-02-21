import { observable, action } from "mobx";
import { Emitter } from "../lib/event";
import { IMIDIKeyEvent, IControlKeyEvent } from "../lib/keyboard";

import { Root } from "./root.store";

export class Keyboard {
  store: typeof Root;

  constructor(store: typeof Root) {
    this.store = store;
    this._setupListeners();
  }

  _onMIDILayoutDown = new Emitter<IMIDIKeyEvent>();
  _onMIDILayoutUp = new Emitter<IMIDIKeyEvent>();
  _onControlLayoutDown = new Emitter<IControlKeyEvent>();
  _onControlLayoutUp = new Emitter<IControlKeyEvent>();

  /**
   * Handles keyboard down when target is any of the dedicated midi keys.
   *
   * - Q W E R T Y
   * - A S D F G H
   */
  onMIDILayoutDown = this._onMIDILayoutDown.event;

  /**
   * Handles keyboard up when target is any of the dedicated midi keys.
   *
   * - Q W E R T Y
   * - A S D F G H
   */
  onMIDILayoutUp = this._onMIDILayoutUp.event;

  /**
   * Triggered when an controller key is pressed.
   *
   * - Arrows.
   * - Space.
   */
  onControlLayoutDown = this._onControlLayoutDown.event;

  /**
   * Triggered when an controller key is unpressed.
   *
   * - Arrows.
   * - Space.
   */
  onControlLayoutUp = this._onControlLayoutDown.event;

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

  _setupListeners = () => {
    document.addEventListener("keydown", this._keyboardListener("down"));
    document.addEventListener("keyup", this._keyboardListener("up"));
  };

  _keyboardListener = (type: "down" | "up") => {
    const midiemitter =
      type === "down" ? this._onMIDILayoutDown : this._onMIDILayoutUp;
    const ctrlemitter =
      type === "down" ? this._onControlLayoutDown : this._onControlLayoutUp;

    return (event: KeyboardEvent) => {
      const midi = (note: string): IMIDIKeyEvent => ({ type: "down", note });
      const ctrl = (key: any): IControlKeyEvent => ({ type: "down", key });

      this._shouldPreventDefault(event) && event.preventDefault();

      switch (event.key) {
        case " ":
          return ctrlemitter.emit(ctrl("Space"));
        case "ArrowUp":
          return ctrlemitter.emit(ctrl("ArrowUp"));
        case "ArrowDown":
          return ctrlemitter.emit(ctrl("ArrowDown"));
        case "ArrowLeft":
          return ctrlemitter.emit(ctrl("ArrowLeft"));
        case "ArrowRight":
          return ctrlemitter.emit(ctrl("ArrowRight"));

        case "q":
        case "w":
        case "e":
        case "r":
        case "t":
        case "y":
          return;

        case "a":
          return midiemitter.emit(midi("C4"));
        case "s":
          return midiemitter.emit(midi("D4"));
        case "d":
          return midiemitter.emit(midi("E4"));
        case "f":
          return midiemitter.emit(midi("F4"));
        case "g":
          return midiemitter.emit(midi("G4"));
        case "h":
          return midiemitter.emit(midi("A4"));
        case "j":
          return midiemitter.emit(midi("B4"));
      }
    };
  };

  _shouldPreventDefault(event: KeyboardEvent): boolean {
    if (event.ctrlKey) {
      if (event.code === "KeyR") return false; // refresh page.

      if (event.shiftKey) {
        if (event.code === "KeyR") return false; // hard refresh page.
        if (event.code === "KeyI") return false; // open dev tools
      }
    }

    return true;
  }
}
