import * as React from "react";
import { observer } from "mobx-react";

import { plugin } from "../../../lib/core";
import { EffectUnit } from "../../EffectUnit";

import "./Mixer.css";
import { MixerModel } from "./Mixer.store";
import { Knob } from "../../Element/Knob";
import styled from "styled-components";

interface IMixerProps {
  model: MixerModel;
  className?: string;
}

/**
 * Main application page component.
 */
@observer
class MixerBase extends React.Component<IMixerProps> {
  componentWillUnmount() {
    this.props.model.dispose();
  }

  render() {
    return (
      <EffectUnit model={this.props.model} className={this.props.className}>
        {this.props.model.gains.map((_, idx) => (
          <Knob
            min={0}
            max={1}
            step={0.01}
            radius={32}
            label="Gain"
            color="#ffffff"
            key={Math.random()}
            onChange={val => this.props.model.setInputGain(idx, val)}
          />
        ))}
      </EffectUnit>
    );
  }
}

// --- styled

export const Mixer = styled(MixerBase)`
  display: flex;
  flex-direction: column;
  justify-content: space-around;
  align-items: center;

  height: 300px;
  width: 120px;
`;

// --- registration

/**
 * Plugin definition.
 */
const options = {
  id: "squidoriginals:mixer",
  name: "Mixer",
  model: MixerModel
};

export default plugin.register(Mixer, options);
