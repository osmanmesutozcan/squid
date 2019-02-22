import * as React from "react";
import { observer } from "mobx-react";

import { plugin } from "../../../lib/core";
import { Knob } from "../../Element/Knob";
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
  _onDelayChange = (value: number) => {
    this.props.model.delayTime = value;
  };

  _onFeedbackChange = (value: number) => {
    this.props.model.feedback = value;
  };

  _onWetChange = (value: number) => {
    this.props.model.wet = value;
  };

  render() {
    const { model } = this.props;

    return (
      <EffectUnit model={model} className="squid-delay-unit">
        <div className="squid-delay-unit-inner">
          <Knob
            min={0}
            max={1}
            label="Delay"
            radius={32}
            color="white"
            onChange={this._onDelayChange}
          />
          <Knob
            min={0}
            max={1}
            label="Dry/Wet"
            radius={32}
            color="white"
            onChange={this._onWetChange}
          />
          <Knob
            min={0}
            max={1}
            label="Feedback"
            radius={32}
            color="white"
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
