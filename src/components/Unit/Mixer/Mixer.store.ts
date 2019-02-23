import * as Tone from "tone";

import { Root } from "../../../stores/root.store";
import { UnitInput, EffectUnitStore, IEffectUnitStore } from "../../EffectUnit";

/**
 * Oscillator unit main model.
 */
export class MixerModel extends EffectUnitStore implements IEffectUnitStore {
  private _gain0: any = new Tone.Gain();
  private _gain1: any = new Tone.Gain();
  private _gain2: any = new Tone.Gain();
  private _gain3: any = new Tone.Gain();
  private _output = new Tone.Gain();

  // keep referance array for quick access
  gains = [this._gain0, this._gain1, this._gain2, this._gain3];

  setInputGain = (idx: number, value: number) => {
    this.gains[idx].gain.exponentialRampTo(value, 0.001);
  };

  constructor(root: typeof Root) {
    super(root);

    this.inputs[0] = new UnitInput(this, this._gain0);
    this.inputs[1] = new UnitInput(this, this._gain1);
    this.inputs[2] = new UnitInput(this, this._gain2);
    this.inputs[3] = new UnitInput(this, this._gain3);

    this._gain0.connect(this._output);
    this._gain1.connect(this._output);
    this._gain2.connect(this._output);
    this._gain3.connect(this._output);

    this.outputs[0] = new UnitInput(this, this._output as any);
  }

  dispose = () => {};
}
