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
   * Current midi octave.
   */
  private _octave = 3;
  private set octave(value: number) {
    if (value < 1) {
      value = 2;
    }
    if (value > 5) {
      value = 5;
    }

    this._octave = value;
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
        case "r":
        case "i":
          return;

        case "[":
          return type === "down" && (this.octave = this._octave - 1);
        case "]":
          return type === "down" && (this.octave = this._octave + 1);

        case "w":
          return midiemitter.emit(midi(`C#${this._octave}`));
        case "e":
          return midiemitter.emit(midi(`D#${this._octave}`));
        case "t":
          return midiemitter.emit(midi(`F#${this._octave}`));
        case "y":
          return midiemitter.emit(midi(`G#${this._octave}`));
        case "u":
          return midiemitter.emit(midi(`A#${this._octave}`));
        case "o":
          return midiemitter.emit(midi(`C#${this._octave + 1}`));
        case "p":
          return midiemitter.emit(midi(`D#${this._octave + 1}`));

        case "a":
          return midiemitter.emit(midi(`C${this._octave}`));
        case "s":
          return midiemitter.emit(midi(`D${this._octave}`));
        case "d":
          return midiemitter.emit(midi(`E${this._octave}`));
        case "f":
          return midiemitter.emit(midi(`F${this._octave}`));
        case "g":
          return midiemitter.emit(midi(`G${this._octave}`));
        case "h":
          return midiemitter.emit(midi(`A${this._octave}`));
        case "j":
          return midiemitter.emit(midi(`B${this._octave}`));
        case "k":
          return midiemitter.emit(midi(`C${this._octave + 1}`));
        case "l":
          return midiemitter.emit(midi(`D${this._octave + 1}`));
        case ";":
          return midiemitter.emit(midi(`E${this._octave + 1}`));
        case "'":
          return midiemitter.emit(midi(`F${this._octave + 1}`));
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
