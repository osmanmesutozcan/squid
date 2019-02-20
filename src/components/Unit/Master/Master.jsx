import React from "react";
import { observable, computed, action } from "mobx";
import { observer } from "mobx-react";
import Tone from "tone";

import { plugin } from "../../../lib/core";
import util from "../../../lib/util";
import EffectUnit, { EffectUnitModel, UnitInput } from "../../EffectUnit";
import Button from "../../Element/Button";
import Slider from "../../Element/Slider";
import Waveform from "../../Element/Waveform";
import "./Master.css";

class MasterModel {
  /**
   * Unique id of the unit
   */
  uuid = null;

  /**
   * Effect unit core.
   */
  unit = null;

  /**
   * Parent data store.
   */
  store = null;

  /**
   * Output count of the unit.
   */
  output = 0;

  /**
   * Input count of the unit.
   */
  input = 1;

  /**
   * Output audio stores.
   */
  outputs = [];

  /**
   * Input audio stores.
   */
  inputs = [];

  /**
   * Is master output muted.
   */
  @observable
  _mute = false;

  @action
  setMute(value) {
    this._master.mute = value;
    this._mute = value;
  }

  @computed
  get mute() {
    return this._mute;
  }
  set mute(value) {
    if (typeof value !== "boolean") {
      throw new Error("mute value can only be a boolean.");
    }
    this.setMute(value);
  }

  /**
   * Output volume of master in Decibels.
   */
  @observable
  _volume = 0;

  @action
  setVolume(value) {
    this._volume = value;
  }

  @computed
  get volume() {
    return this._volume;
  }
  set volume(value) {
    this._master.volume.value = value;
    this.setVolume(value);
  }

  /**
   * Analyser audio node of the master.
   */
  _analyser = new Tone.Waveform(256);

  /**
   * Master output audio node.
   */
  _master = Tone.Master;

  constructor(store, uuid = util.uuid()) {
    this.uuid = uuid;
    this.store = store;

    // input #1 is the master.
    this.unit = new EffectUnitModel(this);
    this.inputs[0] = new UnitInput(this, this._master, {
      offset: {
        x: 0,
        y: 27.5
      }
    });

    this._master.chain(this._analyser);
    this._master.volume.value = this.volume;
    this._master.mute = this.mute;
  }
}

/**
 * Main application page component.
 */
@observer
class Master extends React.Component {
  componentWillUnmount() {
    console.log("should really dispose!");
  }

  /**
   * handles start button.
   * @param {HTMLClickEvent} e click event
   */
  _handleButton = e => {
    this.props.model.mute = !this.props.model.mute;
  };

  /**
   * handle volume changes.
   */
  _onVolumeChange = (e, value) => {
    this.props.model.volume = value;
  };

  render() {
    const { model } = this.props;
    const buttonType = model.mute ? "active" : "inactive";

    return (
      <EffectUnit model={model.unit} className="squid-master-unit">
        <Waveform
          className="squid-master-waveform"
          analyser={model._analyser}
        />

        <Button
          className="squid-master-mute"
          type={buttonType}
          shape="round"
          value={model.volume}
          onClick={this._handleButton}
        >
          {model.mute ? "UNM" : "M"}
        </Button>

        <Slider
          min={-60}
          max={0}
          step={1}
          value={model.volume}
          onChange={this._onVolumeChange}
        />
      </EffectUnit>
    );
  }
}

/**
 * Plugin definition.
 */
const options = {
  id: "squidoriginals:master",
  name: "Master",
  model: MasterModel
};

export default plugin.register(Master, options);
