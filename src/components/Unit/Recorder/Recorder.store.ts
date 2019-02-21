import * as Tone from "tone";
import { observable, action, reaction, IReactionDisposer } from "mobx";

import { Recorder } from "../../../lib/media";
import { DockStore } from "../../Dock";
import {
  EffectUnitModel,
  UnitInput,
  EffectUnitStore,
  IEffectUnitStore
} from "../../EffectUnit";
import { start } from "repl";

/**
 * Oscillator unit main model.
 */
export class RecorderModel extends EffectUnitStore implements IEffectUnitStore {
  // Core unit
  unit: EffectUnitModel;

  // Audio stream record util.
  private _recorder = new Recorder((Tone as any).context);

  // load overrides the default url.
  private _player = new Tone.Player("");

  // --- disposers
  private _recordRectionDispose: IReactionDisposer;

  // --- record
  @observable _recording = false;

  @action toggle = () => {
    this._recording = !this._recording;
  };

  get isRecording() {
    return this._recording;
  }

  private _handleRecord = async () => {
    if (this._recording) {
      return this._recorder.start();
    }

    const data = await this._recorder.stop();
    await this._player.load(URL.createObjectURL(data));
  };

  play = () => {
    try {
      this._player.start();
    } catch {
      console.log("no buffer");
    }
  };

  dispose = () => {
    this._recordRectionDispose();
    this._player.dispose();
  };

  constructor(store: DockStore) {
    super(store);

    this.unit = new EffectUnitModel(this);

    this.inputs[0] = new UnitInput(this, this._recorder.destination as any, {
      offset: {
        x: 0,
        y: 12.5
      }
    });

    this.outputs[0] = new UnitInput(this, this._player, {
      offset: {
        x: 100,
        y: 12.5
      }
    });

    this._recordRectionDispose = reaction(
      () => this._recording,
      this._handleRecord
    );
  }
}
