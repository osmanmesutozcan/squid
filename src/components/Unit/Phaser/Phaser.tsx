import * as React from "react";
import { observer } from "mobx-react";

import { plugin } from "../../../lib/core";
import { EffectUnit } from "../../EffectUnit";

import "./Phaser.css";
import { PhaserModel } from "./Phaser.store";
import { Knob } from "../../Element/Knob";

interface IPhaserProps {
  model: PhaserModel;
}

/**
 * Main application page component.
 */
@observer
export class Phaser extends React.Component<IPhaserProps> {
  componentWillUnmount() {
    this.props.model.dispose();
  }

  render() {
    const options = [
      {
        min: 0,
        max: 1,
        step: 0.001,
        label: "Wet",
        onChange: (val: number) => this.props.model.setWet(val)
      },
      {
        min: 0,
        max: 6,
        step: 0.001,
        label: "Octave",
        onChange: (val: number) => this.props.model.setOctave(val)
      },
      {
        min: 0,
        max: 5,
        step: 0.001,
        label: "Speed",
        onChange: (val: number) => this.props.model.setDepth(val)
      },
      {
        min: 30,
        max: 300,
        step: 0.001,
        label: "Freq",
        onChange: (val: number) => this.props.model.setBaseFrequency(val)
      }
    ];

    return (
      <EffectUnit model={this.props.model} className="squid-phaser-unit">
        {options.map(opt => (
          <Knob
            min={opt.min}
            max={opt.max}
            step={opt.step}
            radius={32}
            color="#ffffff"
            label={opt.label}
            onChange={opt.onChange}
            key={Math.random()}
          />
        ))}
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
