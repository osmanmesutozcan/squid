import * as React from "react";
import { observer } from "mobx-react";

import "./Mezosphere.css";
import { plugin } from "../../../lib/core";
import { EffectUnit } from "../../EffectUnit";
import { MezosphereModel } from "./Mezosphere.store";

interface IMezosphereProps {
  model: MezosphereModel;
}

/**
 * 1 bar 16 step sequencer.
 */
@observer
class Sequencer extends React.Component<IMezosphereProps> {
  componentWillUnmount() {
    this.props.model.dispose();
  }

  render() {
    return (
      <EffectUnit model={this.props.model} className="squid-sequencer-unit">
        Mezos
      </EffectUnit>
    );
  }
}

/**
 * Plugin definition.
 */
const options = {
  id: "squidoriginals:mezosphere",
  name: "Mezosphere",
  model: MezosphereModel
};

export default plugin.register(Sequencer, options);
