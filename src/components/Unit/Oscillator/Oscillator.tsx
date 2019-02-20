import * as React from "react";

import { EffectUnit } from "../../EffectUnit";
import { plugin } from "../../../lib/core";
import { Draggable as Controller } from "../../Element/Controller";

import "./Oscillator.css";
import { OscillatorModel } from "./Oscillator.model";

interface IOscillator {
  model: OscillatorModel;
}

/**
 * Generate weird sounds.
 */
class Oscillator extends React.Component<IOscillator> {
  componentWillUnmount() {
    this.props.model.dispose();
  }

  /**
   * Slowly reduce the volume on end drag
   * so it won't make clicky noises.
   */
  _endDrag = () => {
    this.props.model.oscillator.volume.rampTo(-Infinity, 0.05);
  };

  render() {
    return (
      <EffectUnit
        model={this.props.model.unit}
        className="squid-oscillator-unit"
      >
        <Controller
          end={this._endDrag}
          unit={this.props.model.oscillator}
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
