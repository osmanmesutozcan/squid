import * as React from "react";
import { observer } from "mobx-react";

import { plugin } from "../../../lib/core";
import { EffectUnit } from "../../EffectUnit";

import "./Mixer.css";
import { MixerModel } from "./Mixer.store";

interface IMixerProps {
  model: MixerModel;
}

/**
 * Main application page component.
 */
@observer
class Mixer extends React.Component<IMixerProps> {
  componentWillUnmount() {
    this.props.model.dispose();
  }

  render() {
    return (
      <EffectUnit model={this.props.model} className="squid-mixer-unit">
        MiX
      </EffectUnit>
    );
  }
}

/**
 * Plugin definition.
 */
const options = {
  id: "squidoriginals:mixer",
  name: "Mixer",
  model: MixerModel
};

export default plugin.register(Mixer, options);
