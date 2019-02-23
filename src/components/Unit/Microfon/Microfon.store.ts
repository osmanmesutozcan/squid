import * as Tone from "tone";
import { observable, action, computed } from "mobx";

import { UnitInput, IEffectUnitStore, EffectUnitStore } from "../../EffectUnit";
import { Root } from "../../../stores/root.store";

/**
 * Microfon unit local state.
 */
export class MicrofonModel extends EffectUnitStore implements IEffectUnitStore {
  /**
   * Analyser node.
   */
  private _analyser: Tone.Waveform;
  get analyser() {
    return this._analyser;
  }

  /**
   * Microfon audio node.
   */
  private _microfon: Tone.UserMedia | null = null;

  /**
   * Current state of the microfon.
   */
  @observable private _opened = false;

  @computed
  get opened() {
    return this._opened;
  }

  /**
   * Open microfon.
   */
  @action
  open = () => {
    if (!this._microfon) {
      console.error("mic is not initialized. cannot open");
      return;
    }

    this._microfon.open(`microfon:${this.uuid}`);
    this._opened = true;
  };

  /**
   * Close microfon.
   */
  @action
  close = () => {
    if (!this._microfon) {
      console.error("mic is not initialized. cannot close");
      return;
    }

    this._microfon.close();
    this._opened = false;
  };

  constructor(root: typeof Root) {
    super(root);
    this._analyser = new Tone.Waveform(256);
    this.outputs[0] = new UnitInput(this, this._analyser);
  }

  /**
   * Initialize microfon
   */
  init = () => {
    this._microfon = new Tone.UserMedia();
    this._microfon.connect(this._analyser);
  };

  /**
   * Clean up.
   */
  dispose = () => {
    if (this._microfon) {
      this._microfon.dispose();
    }

    this._analyser.dispose();
  };
}
