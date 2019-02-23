import * as Tone from "tone";

import { IMIDIKeyEvent } from "../../../lib/keyboard";
import { EffectUnitStore, IEffectUnitStore, UnitInput } from "../../EffectUnit";
import { Root } from "../../../stores/root.store";

/**
 * Sequencer unit main model.
 */
export class MezosphereModel extends EffectUnitStore
  implements IEffectUnitStore {
  /**
   * Synth audio node.
   */
  private _synth = new Tone.PolySynth(8, Tone.Synth);

  constructor(root: typeof Root) {
    super(root);

    this._synth.set("envelope.attack", 0.4);
    this._synth.set("envelope.sustain", 1);
    this._synth.set("envelope.release", 0.4);

    this.outputs[0] = new UnitInput(this, this._synth);

    this._disposeOnMIDILayoutDown = root.keyboard.onMIDILayoutDown(
      this._handleMIDIKeysDown
    );
    this._disposeOnMIDILayoutUp = root.keyboard.onMIDILayoutUp(
      this._handleMIDIKeysUp
    );
  }

  // --- Record
  _keydownMap = new Map<string, undefined>();

  _handleMIDIKeysDown = (e: IMIDIKeyEvent) => {
    if (!this._keydownMap.has(e.note)) {
      this._keydownMap.set(e.note, undefined);
      this._synth.triggerAttack([e.note], "+0.005");
    }
  };

  _handleMIDIKeysUp = (e: IMIDIKeyEvent) => {
    this._keydownMap.delete(e.note);
    this._synth.triggerRelease([e.note], "+0.005");
  };

  // --- Playback
  // ...

  // Keyboard event disposables
  _disposeOnMIDILayoutDown: Function;
  _disposeOnMIDILayoutUp: Function;

  dispose = () => {
    this._synth.dispose();
    this._disposeOnMIDILayoutDown();
    this._disposeOnMIDILayoutUp();
  };
}
