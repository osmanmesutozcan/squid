import * as React from "react";
import { observer } from "mobx-react";

import { plugin } from "../../../lib/core";
import { EffectUnit } from "../../EffectUnit";

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
        CRUSH ME
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
