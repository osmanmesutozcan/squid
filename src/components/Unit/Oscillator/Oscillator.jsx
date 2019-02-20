import React from "react";
import Tone from "tone";

import { plugin } from "../../../lib/core";
import util from "../../../lib/util";
import EffectUnit, { EffectUnitModel, UnitInput } from "../../EffectUnit";
import Controller from "../../Element/Controller";
import "./Oscillator.css";

/**
 * Oscillator unit main model.
 */
class OscillatorModel {
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
  output = 1;

  /**
   * Input count of the unit.
   */
  input = 0;

  /**
   * Output audio nodes.
   */
  outputs = [];

  /**
   * Input audio nodes.
   */
  inputs = [];

  /**
   * Oscillator audio node.
   */
  _oscillator = new Tone.Oscillator();

  // Keyboard event disposables
  _disposeOnMIDILayoutDown;
  _disposeOnMIDILayoutUp;

  constructor(store, uuid = util.uuid()) {
    this.uuid = uuid;
    this.store = store;

    this.unit = new EffectUnitModel(this);
    this.outputs[0] = new UnitInput(this, this._oscillator, {
      offset: {
        x: 100,
        y: 27.5
      }
    });

    this._oscillator.frequency.value = 0;
    this._oscillator.start();
  }

  dispose = () => {
    this._oscillator.dispose();
  };
}

/**
 * Generate weird sounds.
 */
class Oscillator extends React.Component {
  componentWillUnmount() {
    this.props.model.dispose();
  }

  /**
   * Slowly reduce the volume on end drag
   * so it won't make clicky noises.
   */
  _endDrag = () => {
    this.props.model._oscillator.volume.rampTo(-Infinity, 0.05);
  };

  render() {
    return (
      <EffectUnit
        model={this.props.model.unit}
        className="squid-oscillator-unit"
      >
        <Controller.Draggable
          end={this._endDrag}
          unit={this.props.model._oscillator}
          params={{
            x: {
              min: 60,
              max: 2000,
              param: "frequency"
            },
            y: {
              min: 0,
              max: -40,
              param: "volume"
            }
          }}
        />
      </EffectUnit>
    );
  }
}

/**
 * Plugin definition.
 */
const options = {
  id: "squidoriginals:oscillator",
  name: "Oscillator",
  model: OscillatorModel
};

export default plugin.register(Oscillator, options);
