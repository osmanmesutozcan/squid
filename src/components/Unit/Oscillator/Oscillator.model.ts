import * as Tone from "tone";
import {
  EffectUnitModel,
  UnitInput,
  EffectUnitStore,
  IEffectUnitStore
} from "../../EffectUnit";
import { DockStore } from "../../Dock";

/**
 * Oscillator unit main model.
 */
export class OscillatorModel extends EffectUnitStore
  implements IEffectUnitStore {
  /**
   * EffectUnitCore
   */
  unit: EffectUnitModel;

  /**
   * Oscillator audio node.
   */
  private _oscillator: Tone.Oscillator;
  get oscillator() {
    return this._oscillator;
  }

  constructor(store: DockStore) {
    super(store, 0, 1);

    this._oscillator = new Tone.Oscillator();
    this._oscillator.frequency.value = 0;
    this._oscillator.start();

    this.unit = new EffectUnitModel(this);
    this.outputs[0] = new UnitInput(this, this._oscillator, {
      offset: {
        x: 100,
        y: 27.5
      }
    });
  }

  dispose = () => {
    this._oscillator.dispose();
  };
}
