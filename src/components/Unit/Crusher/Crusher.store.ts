import * as Tone from "tone";

import { DockStore } from "../../Dock";
import { UnitInput, EffectUnitStore, IEffectUnitStore } from "../../EffectUnit";

/**
 * Oscillator unit main model.
 */
export class CrusherModel extends EffectUnitStore implements IEffectUnitStore {
  private _crusher = new Tone.BitCrusher(1);

  dispose = () => {
    this._crusher.dispose();
  };

  constructor(store: DockStore) {
    super(store);

    this.inputs[0] = new UnitInput(this, this._crusher);
    this.outputs[0] = new UnitInput(this, this._crusher);
  }
}
