import * as Tone from "tone";
import { observable, computed, action } from "mobx";
import { UnitInput, EffectUnitStore, IEffectUnitStore } from "../../EffectUnit";
import { Root } from "../../../stores/root.store";

export class MasterModel extends EffectUnitStore implements IEffectUnitStore {
  /**
   * Is master output muted.
   */
  @observable
  _mute = false;

  @action
  setMute(value: boolean) {
    this._master.mute = value;
    this._mute = value;
  }
  @computed
  get mute() {
    return this._mute;
  }
  set mute(value) {
    this.setMute(value);
  }

  /**
   * Output volume of master in Decibels.
   */
  @observable
  _volume = 0;

  @action
  setVolume(value: number) {
    this._master.volume.value = value;
    this._volume = value;
  }

  @computed
  get volume() {
    return this._volume;
  }

  /**
   * Analyser audio node of the master.
   */
  _analyser = new Tone.Waveform(256);

  /**
   * Master output audio node.
   */
  _master = Tone.Master;

  constructor(root: typeof Root) {
    super(root);

    this.inputs[0] = new UnitInput(this, this._master);

    this._master.chain(this._analyser);
    this._master.volume.value = this.volume;
    this._master.mute = this.mute;
  }

  dispose = () => {
    console.error(
      "master node is disposed! this node should not be removed from the dock!"
    );
  };
}
