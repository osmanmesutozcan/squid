import * as Tone from "tone";
import { observable, action } from "mobx";

import { IMIDIKeyEvent, IControlKeyEvent } from "../../../lib/keyboard";
import { DockStore } from "../../Dock";
import {
  EffectUnitStore,
  IEffectUnitStore,
  EffectUnitModel,
  UnitInput
} from "../../EffectUnit";

/**
 * Sequencer unit main model.
 */
export class SequencerModel extends EffectUnitStore
  implements IEffectUnitStore {
  /**
   * Effect unit core.
   */
  unit: EffectUnitModel;

  /**
   * Display model.
   */
  display: DisplayModel;

  /**
   * Synth audio node.
   */
  private _synth = new Tone.Synth({
    oscillator: {
      type: "triangle"
    },
    envelope: {
      attack: 0.005,
      decay: 0.1,
      sustain: 0.3,
      release: 1
    }
  });

  constructor(store: DockStore) {
    super(store);

    this.display = new DisplayModel();

    this.unit = new EffectUnitModel(this);

    this.outputs[0] = new UnitInput(this, this._synth, {
      offset: {
        x: 100,
        y: 27.5
      }
    });

    this._disposeOnMIDILayoutDown = this.store.root.keyboard.onMIDILayoutDown(
      this._handleMIDIKeysDown
    );
    this._disposeOnMIDILayoutUp = this.store.root.keyboard.onMIDILayoutUp(
      this._handleMIDIKeysUp
    );
    this._disposeOnControlLayoutDown = this.store.root.keyboard.onControlLayoutDown(
      this._handleNextPosition
    );
  }

  // --- Record
  _keydownMap = new Map<string, undefined>();

  _handleMIDIKeysDown = (e: IMIDIKeyEvent) => {
    if (!this._keydownMap.has(e.note)) {
      this._keydownMap.set(e.note, undefined);
      this._synth.triggerAttack(e.note);
    }
  };

  _handleMIDIKeysUp = (e: IMIDIKeyEvent) => {
    this._keydownMap.delete(e.note);
    this._synth.triggerRelease();
  };

  _handleNextPosition = (e: IControlKeyEvent) => {
    if (e.key === "ArrowRight") {
      this.display.increment();
    }
  };

  // --- Playback
  // ...

  // Keyboard event disposables
  _disposeOnMIDILayoutDown: Function;
  _disposeOnMIDILayoutUp: Function;
  _disposeOnControlLayoutDown: Function;

  dispose = () => {
    this._synth.dispose();
    this._disposeOnMIDILayoutDown();
    this._disposeOnMIDILayoutUp();

    this.display.dispose();
  };
}

class DisplayModel {
  loop: Tone.Loop;

  @observable position = 0;

  @action private _setPosition = (position: number) => {
    this.position = position % 16;
  };

  increment() {
    this._setPosition(this.position + 1);
  }

  constructor() {
    this.loop = new Tone.Loop(() => {
      this._setPosition(this.position + 1);
    }, "16n");

    this.loop.start(0);

    // sync display with transport
    Tone.Transport.on("stop", action(() => (this.position = 0)));
    Tone.Transport.on("start", action(() => (this.position = 0)));
  }

  dispose = () => {
    this.loop.stop(0);
    this.loop.cancel();
  };
}
