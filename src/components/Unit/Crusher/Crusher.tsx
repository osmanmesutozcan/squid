import * as React from "react";
import { observer } from "mobx-react";

import { plugin } from "../../../lib/core";
import { EffectUnit } from "../../EffectUnit";
import { Knob } from "../../Element/Knob";

import "./Crusher.css";
import { CrusherModel } from "./Crusher.store";

interface ICrushserProps {
  model: CrusherModel;
}

/**
 * Main application page component.
 */
@observer
class Crusher extends React.Component<ICrushserProps> {
  componentWillUnmount() {
    this.props.model.dispose();
  }

  render() {
    return (
      <EffectUnit model={this.props.model} className="squid-crusher-unit">
        <Knob
          min={1}
          max={8}
          step={0.001}
          radius={32}
          color="#ffffff"
          label="Bitrate"
          onChange={val => this.props.model.setBitRate(val)}
        />
      </EffectUnit>
    );
  }
}

/**
 * Plugin definition.
 */
const options = {
  id: "squidoriginals:crusher",
  name: "Crusher",
  model: CrusherModel
};

export default plugin.register(Crusher, options);
