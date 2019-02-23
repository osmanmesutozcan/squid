import * as Tone from "tone";
import { observable, action } from "mobx";
import { Root } from "./root.store";

export enum PlaybackStatus {
  PLAY = "PLAY",
  PAUSE = "PAUSE",
  STOP = "STOP"
}

export class Playback {
  store: typeof Root;

  /**
   * BPM.
   */
  @observable _bpm = 127;

  @observable _status = PlaybackStatus.PAUSE;

  @action.bound
  set bpm(value: number) {
    this._bpm = value;
  }

  constructor(store: typeof Root) {
    this.store = store;
    this._setupTransportListeners();
  }

  _setupTransportListeners = () => {
    Tone.Transport.on(
      "start",
      action(() => (this._status = PlaybackStatus.PLAY))
    );
    Tone.Transport.on(
      "stop",
      action(() => (this._status = PlaybackStatus.STOP))
    );
  };
}
