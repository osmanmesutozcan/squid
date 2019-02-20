import Tone from "tone";
import { observable, action } from "mobx";

export const PlaybackStatus = {
  PLAY: "PLAY",
  PAUSE: "PAUSE",
  STOP: "STOP"
};

export class Playback {
  /**
   * BPM.
   */
  @observable _bpm = 106;

  @action.bound
  set bpm(value) {
    this._bpm = value;
  }

  @observable _status = PlaybackStatus.PAUSE;

  constructor(store) {
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
