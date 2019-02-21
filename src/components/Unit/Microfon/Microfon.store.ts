import * as Tone from "tone";
import { observable, action, computed } from "mobx";

import { DockStore } from "../../Dock";
import {
  EffectUnitModel,
  UnitInput,
  IEffectUnitStore,
  EffectUnitStore
} from "../../EffectUnit";

/**
 * Microfon unit local state.
 */
export class MicrofonModel extends EffectUnitStore implements IEffectUnitStore {
  /**
   * Child store of this unit.
   */
  unit: EffectUnitModel;

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

  constructor(store: DockStore) {
    super(store);

    this.unit = new EffectUnitModel(this);
    this._analyser = new Tone.Waveform(256);
  }

  /**
   * Initialize microfon
   */
  init = () => {
    this._microfon = new Tone.UserMedia();
    this._microfon.connect(this._analyser);

    // Detach output #1 to analyser
    this.outputs[0] = new UnitInput(this, this._analyser, {
      offset: {
        x: 100,
        y: 27.5
      }
    });
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
