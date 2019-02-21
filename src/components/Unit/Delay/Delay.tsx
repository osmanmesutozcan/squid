import * as React from "react";
import { observer } from "mobx-react";

import { plugin } from "../../../lib/core";
import { Slider } from "../../Element/Slider";
import { EffectUnit } from "../../EffectUnit";

import "./Delay.css";
import { DelayModel } from "./Delay.store";

interface IDelayProps {
  model: DelayModel;
}

/**
 * Delay unit.
 */
@observer
class Delay extends React.Component<IDelayProps> {
  /**
   * handle volume changes.
   */
  _onDelayChange = (_: any, value: number) => {
    this.props.model.delayTime = value;
  };

  /**
   * handle volume changes.
   */
  _onFeedbackChange = (_: any, value: number) => {
    this.props.model.feedback = value;
  };

  /**
   * handle volume changes.
   */
  _onWetChange = (_: any, value: number) => {
    this.props.model.wet = value;
  };

  render() {
    const { model } = this.props;

    return (
      <EffectUnit model={model} className="squid-delay-unit">
        <div className="squid-delay-unit-inner">
          <Slider
            className="squid-delay-slider"
            min={0}
            max={1}
            step={0.001}
            value={model.delayTime}
            onChange={this._onDelayChange}
          />

          <Slider
            className="squid-delay-slider"
            min={0}
            max={1}
            step={0.01}
            value={model.wet}
            onChange={this._onWetChange}
          />

          <Slider
            className="squid-delay-slider"
            min={0}
            max={1}
            step={0.01}
            value={model.feedback}
            onChange={this._onFeedbackChange}
          />
        </div>
      </EffectUnit>
    );
  }
}

/**
 * Plugin definition.
 */
const options = {
  id: "squidoriginals:delay",
  name: "Delay",
  model: DelayModel
};

export default plugin.register(Delay, options);
