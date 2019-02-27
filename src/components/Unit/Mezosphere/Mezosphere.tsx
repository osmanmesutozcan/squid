import * as React from "react";
import { observer } from "mobx-react";

import "./Mezosphere.css";
import { plugin } from "../../../lib/core";
import { EffectUnit } from "../../EffectUnit";
import { MezosphereModel } from "./Mezosphere.store";
import { Knob } from "../../Element/Knob";

interface IMezosphereProps {
  model: MezosphereModel;
}

/**
 * 1 bar 16 step sequencer.
 */
@observer
class Sequencer extends React.Component<IMezosphereProps> {
  private _types = ["fmsquare", "fatsquare"];

  componentWillUnmount() {
    this.props.model.dispose();
  }

  render() {
    return (
      <EffectUnit model={this.props.model} className="squid-sequencer-unit">
        <Knob
          min={0}
          max={1}
          step={1}
          radius={32}
          label="type"
          color="#ffffff"
          onChange={val =>
            this.props.model.setSyth1Type(this._types[val], "", 4)
          }
        />
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
