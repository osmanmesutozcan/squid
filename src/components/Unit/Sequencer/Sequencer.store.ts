import * as Tone from "tone";
import { observable, action } from "mobx";

import { IControlKeyEvent } from "../../../lib/keyboard";
import { EffectUnitStore, IEffectUnitStore, UnitInput } from "../../EffectUnit";
import { Root } from "../../../stores/root.store";

import { bassDrum } from "./instruments/BassDrum";
import { openHihat } from "./instruments/OpenHiHat";
import { closedHiHat } from "./instruments/ClosedHiHat";

/**
 * Sequencer unit main model.
 */
export class SqcrModel extends EffectUnitStore implements IEffectUnitStore {
  /**
   * Sequencer output.
   */
  private _gain = new Tone.Gain(1);

  /**
   * Display model.
   */
  looper: LooperModel = new LooperModel(this._gain);

  constructor(root: typeof Root) {
    super(root);

    this.outputs[0] = new UnitInput(this, this._gain as any);

    this._disposeOnControlLayoutDown = root.keyboard.onControlLayoutDown(
      this._handleNextPosition
    );
  }

  _handleNextPosition = (e: IControlKeyEvent) => {
    if (e.key === "ArrowRight") {
      this.looper.increment();
    }
  };

  // Keyboard event disposables
  _disposeOnControlLayoutDown: Function;

  dispose = () => {
    this._disposeOnControlLayoutDown();
    this.looper.dispose();
  };
}

/**
 * This syncs with transport and updates display and record state
 */
class LooperModel {
  private _sequence: Tone.Sequence;

  // Referances to instruments
  _bassDrum = bassDrum();
  _openHiHat = openHihat();
  _closedHiHat = closedHiHat();

  /**
   * Synth audio nodes trigger methods.
   * Synths have different methods to trigger
   *
   * - 0 -> BassDrum
   * - 1 -> Open HiHat
   */
  private _synths = [
    (t: any, d: any, n: any) => this._bassDrum.triggerAttackRelease(n, d, t),
    (t: any, d: any, n: any) => this._openHiHat.triggerAttack(t),
    (t: any, d: any, n: any) => this._closedHiHat.triggerAttack(t)
  ];

  /**
   * Notes to trigger on each synth.
   *
   * - 0 -> BassDrum
   * - 1 -> Open HiHat
   */
  private _notes = ["C2", "N/A"];

  /**
   * Hi hat filter.
   */
  private _filter = new Tone.Filter({ frequency: 14000 });

  /**
   * Each map in array represents a bar and
   * notes are registered in the map.
   */
  @observable
  registered: Map<number, number>[] = Array(16)
    .fill(null)
    .map(() => new Map());

  /**
   * Currently selected intrument
   */
  @observable instrument = 0;

  /**
   * Position of the
   */
  @observable position = -1;
  increment = () => this._setPosition(this.position + 1);

  @action
  toggleNote = (idx: number) => {
    if (this.registered[idx].has(this.instrument)) {
      this.registered[idx].delete(this.instrument);
    } else {
      this.registered[idx].set(this.instrument, this.instrument);
    }
  };

  constructor(private _gain: Tone.Gain) {
    this._bassDrum.connect(this._gain);
    this._openHiHat.chain(this._filter, this._gain);
    this._closedHiHat.chain(this._filter, this._gain);

    this._sequence = new Tone.Sequence(
      this._loopNextTick,
      this.registered as any,
      "16n"
    );

    // sync display with transport
    Tone.Transport.on(
      "stop",
      action(() => {
        this.position = -1;
        this._sequence.stop(0);
      })
    );

    Tone.Transport.on(
      "start",
      action(() => {
        this.position = 0;
        this._sequence.start(0);
      })
    );
  }

  @action private _setPosition = (position: number) => {
    this.position = position % 16;
  };

  private _loopNextTick = (t: any) => {
    this.registered[this.position.valueOf()].forEach(i => {
      this._synths[i](t, "8n", this._notes[i]);
    });

    Tone.Draw.schedule(() => {
      this._setPosition(this.position + 1);
    }, t);
  };

  dispose = () => {
    this._sequence.stop(0);
    this._sequence.cancel();
  };
}
