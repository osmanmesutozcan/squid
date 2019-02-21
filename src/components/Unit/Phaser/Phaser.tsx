import * as React from "react";
import { observer } from "mobx-react";

import { plugin } from "../../../lib/core";
import { EffectUnit } from "../../EffectUnit";

import "./Phaser.css";
import { PhaserModel } from "./Phaser.store";

interface IPhaserProps {
  model: PhaserModel;
}

/**
 * Main application page component.
 */
@observer
class Phaser extends React.Component<IPhaserProps> {
  componentWillUnmount() {
    this.props.model.dispose();
  }

  render() {
    return (
      <EffectUnit model={this.props.model} className="squid-phaser-unit">
        PHASE ME
      </EffectUnit>
    );
  }
}

/**
 * Plugin definition.
 */
const options = {
  id: "squidoriginals:phaser",
  name: "Phaser",
  model: PhaserModel
};

export default plugin.register(Phaser, options);
