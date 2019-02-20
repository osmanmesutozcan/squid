import React from "react";
import Tone from "tone";
import { observable, action, computed } from "mobx";
import { observer } from "mobx-react";

import util from "../../../lib/util";
import { plugin } from "../../../lib/core";
import EffectUnit, { EffectUnitModel, UnitInput } from "../../EffectUnit";
import Button from "../../Element/Button";
import Waveform from "../../Element/Waveform";
import "./Microfon.css";

/**
 * Microfon unit local state.
 */
class MicrofonModel {
  /**
   * Unique id for the unit.
   */
  uuid = null;

  /**
   * Parent store of the unit.
   */
  store = null;

  /**
   * Child store of this unit.
   */
  unit = null;

  /**
   * Output count of the unit.
   */
  output = 1;

  /**
   * Input count of the unit.
   */
  input = 0;

  /**
   * Output audio stores.
   */
  outputs = [];

  /**
   * Input audio stores.
   */
  inputs = [];

  /**
   * Analyser node.
   */
  _analyser = null;

  /**
   * Microfon audio node.
   */
  _microfon = null;

  /**
   * Current state of the microfon.
   */
  @observable
  _opened = false;

  @computed
  get opened() {
    return this._opened;
  }

  /**
   * Open microfon.
   */
  @action
  open = () => {
    this._microfon.open();
    this._opened = true;
  };

  /**
   * Close microfon.
   */
  @action
  close = () => {
    this._microfon.close();
    this._opened = false;
  };

  constructor(store, uuid = util.uuid()) {
    this.uuid = uuid;
    this.store = store;

    this.unit = new EffectUnitModel(this);
    this._analyser = new Tone.Waveform(256);
  }

  /**
   * Initialize microfon
   */
  init = () => {
    this._microfon = new Tone.UserMedia();
    this._microfon.connect(this._analyser);

    // Detach output #1 to analyser
    this.outputs[0] = new UnitInput(this, this._analyser, {
      offset: {
        x: 100,
        y: 27.5
      }
    });
  };

  /**
   * Clean up.
   */
  dispose = () => {
    this._microfon.dispose();
    this._analyser.dispose();
  };
}

/**
 * Main application page component.
 */
@observer
class Microfon extends React.Component {
  componentDidMount() {
    this.props.model.init();
  }

  componentWillUnmount() {
    this.props.model.dispose();
  }

  _toggleMic = () => {
    if (this.props.model.opened) {
      this.props.model.close();
    } else {
      this.props.model.open();
    }
  };

  render() {
    const { model } = this.props;

    const buttonType = model.opened ? "active" : "inactive";

    return (
      <EffectUnit model={model.unit} className="squid-microfon-unit">
        <Waveform
          className="squid-microfonunit-waveform"
          analyser={model._analyser}
        />

        <Button
          className="squid-microfonunit-start"
          type={buttonType}
          shape="round"
          onClick={this._toggleMic}
        >
          {model.opened ? "STOP" : "START"}
        </Button>
      </EffectUnit>
    );
  }
}

/**
 * Plugin definition.
 */
const options = {
  id: "squidoriginals:microfon",
  name: "Microfon",
  model: MicrofonModel
};

export default plugin.register(Microfon, options);
