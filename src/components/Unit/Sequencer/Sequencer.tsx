import * as React from "react";
import { observer } from "mobx-react";

import "./Sequencer.css";
import { plugin } from "../../../lib/core";
import { EffectUnit } from "../../EffectUnit";
import { SequencerModel } from "./Sequencer.store";

interface ISequencerProps {
  model: SequencerModel;
}

/**
 * 1 bar 16 step sequencer.
 */
@observer
class Sequencer extends React.Component<ISequencerProps> {
  componentWillUnmount() {
    this.props.model.dispose();
  }

  render() {
    return (
      <EffectUnit
        model={this.props.model.unit}
        className="squid-sequencer-unit"
      >
        <SequencerDisplay model={this.props.model} />
      </EffectUnit>
    );
  }
}

interface ISequencerDisplayProps {
  model: SequencerModel;
}

@observer
class SequencerDisplay extends React.Component<ISequencerDisplayProps> {
  private _displayArea: SVGSVGElement | null = null;

  render() {
    const pos = (200 / 16) * this.props.model.display.position;
    const indicatorPosition = {
      x1: pos,
      x2: pos,

      y1: 0,
      y2: 100
    };

    return (
      <svg
        ref={node => (this._displayArea = node)}
        className="squid-sequencer-display"
      >
        <line
          {...indicatorPosition}
          className="squid-sequencer-display-position-indicator"
        />
      </svg>
    );
  }
}

/**
 * Plugin definition.
 */
const options = {
  id: "squidoriginals:sequencer",
  name: "Sequencer",
  model: SequencerModel
};

export default plugin.register(Sequencer, options);
