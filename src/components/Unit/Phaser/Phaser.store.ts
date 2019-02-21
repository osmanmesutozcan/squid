import * as Tone from "tone";

import { DockStore } from "../../Dock";
import { UnitInput, EffectUnitStore, IEffectUnitStore } from "../../EffectUnit";

/**
 * Oscillator unit main model.
 */
export class PhaserModel extends EffectUnitStore implements IEffectUnitStore {
  private _phaser = new Tone.Phaser({
    frequency: 15,
    octaves: 5,
    baseFrequency: 1000
  });

  dispose = () => {
    this._phaser.dispose();
  };

  constructor(store: DockStore) {
    super(store);

    this.inputs[0] = new UnitInput(this, this._phaser);
    this.outputs[0] = new UnitInput(this, this._phaser);
  }
}
