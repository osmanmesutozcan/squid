import * as Tone from "tone";

import { UnitInput, EffectUnitStore, IEffectUnitStore } from "../../EffectUnit";
import { Root } from "../../../stores/root.store";

/**
 * Oscillator unit main model.
 */
export class PhaserModel extends EffectUnitStore implements IEffectUnitStore {
  private _phaser = new Tone.Phaser();

  setWet = (value: number) => {
    this._phaser.wet.exponentialRampTo(value, 0.001);
  };

  setOctave = (value: number) => {
    this._phaser.octaves = value;
  };

  setDepth = (value: number) => {
    this._phaser.frequency.exponentialRampTo(value, 0.001);
  };

  setBaseFrequency = (value: number) => {
    this._phaser.baseFrequency = value;
  };

  dispose = () => {
    this._phaser.dispose();
  };

  constructor(root: typeof Root) {
    super(root);

    this.inputs[0] = new UnitInput(this, this._phaser);
    this.outputs[0] = new UnitInput(this, this._phaser);
  }
}
