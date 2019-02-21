import * as Tone from "tone";
import { observable, action, reaction, IReactionDisposer } from "mobx";

import { Recorder } from "../../../lib/media";
import { DockStore } from "../../Dock";
import { UnitInput, EffectUnitStore, IEffectUnitStore } from "../../EffectUnit";

/**
 * Oscillator unit main model.
 */
export class RecorderModel extends EffectUnitStore implements IEffectUnitStore {
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

    this.inputs[0] = new UnitInput(this, this._recorder.destination as any);
    this.outputs[0] = new UnitInput(this, this._player);

    this._recordRectionDispose = reaction(
      () => this._recording,
      this._handleRecord
    );
  }
}
