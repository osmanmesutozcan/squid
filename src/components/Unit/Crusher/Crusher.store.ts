import * as Tone from "tone";

import { UnitInput, EffectUnitStore, IEffectUnitStore } from "../../EffectUnit";
import { Root } from "../../../stores/root.store";

/**
 * Oscillator unit main model.
 */
export class CrusherModel extends EffectUnitStore implements IEffectUnitStore {
  private _crusher = new Tone.BitCrusher(8);

  setWet = (value: number) => {
    this._crusher.wet.exponentialRampTo(value, 0.001);
  };

  setBitRate = (value: number) => {
    this._crusher.bits = value;
  };

  dispose = () => {
    this._crusher.dispose();
  };

  constructor(root: typeof Root) {
    super(root);

    this.inputs[0] = new UnitInput(this, this._crusher);
    this.outputs[0] = new UnitInput(this, this._crusher);
  }
}
