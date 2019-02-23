import * as Tone from "tone";
import { UnitInput, EffectUnitStore, IEffectUnitStore } from "../../EffectUnit";
import { Root } from "../../../stores/root.store";

/**
 * Oscillator unit main model.
 */
export class OscModel extends EffectUnitStore implements IEffectUnitStore {
  /**
   * Oscillator audio node.
   */
  private _oscillator: Tone.Oscillator;
  get oscillator() {
    return this._oscillator;
  }

  constructor(root: typeof Root) {
    super(root);

    this._oscillator = new Tone.Oscillator();
    this._oscillator.frequency.exponentialRampTo(0, 0.001);
    this._oscillator.start();

    this.outputs[0] = new UnitInput(this, this._oscillator);
  }

  dispose = () => {
    this._oscillator.dispose();
  };
}
