import * as Tone from "tone";
import { observable, action, reaction, IReactionDisposer } from "mobx";

import { DockStore } from "../../Dock";
import { UnitInput, EffectUnitStore, IEffectUnitStore } from "../../EffectUnit";

/**
 * Oscillator unit main model.
 */
export class MixerModel extends EffectUnitStore implements IEffectUnitStore {
  constructor(store: DockStore) {
    super(store);

    // audio nodes
    const _vol0 = new Tone.Volume();
    const _vol1 = new Tone.Volume();
    const _vol2 = new Tone.Volume();
    const _vol3 = new Tone.Volume();
    const _output = new Tone.Gain();

    this.inputs[0] = new UnitInput(this, _vol0);
    this.inputs[1] = new UnitInput(this, _vol1);
    this.inputs[2] = new UnitInput(this, _vol2);
    this.inputs[3] = new UnitInput(this, _vol3);

    _vol0.connect(_output);
    _vol1.connect(_output);
    _vol2.connect(_output);
    _vol3.connect(_output);

    this.outputs[0] = new UnitInput(this, _output as any);
  }

  dispose = () => {};
}
