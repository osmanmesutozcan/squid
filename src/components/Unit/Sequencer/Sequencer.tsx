import * as React from "react";
import { observer } from "mobx-react";

import { plugin } from "../../../lib/core";
import { EffectUnit } from "../../EffectUnit";
import { SqcrModel } from "./Sequencer.store";
import styled from "styled-components";
import { Knob } from "../../Element/Knob";

interface ISequencerProps {
  className?: string;
  model: SqcrModel;
}

/**
 * 1 bar 16 step sequencer.
 */
@observer
class SequencerBase extends React.Component<ISequencerProps> {
  componentWillUnmount() {
    this.props.model.dispose();
  }

  render() {
    return (
      <EffectUnit model={this.props.model} className={this.props.className}>
        <Knob
          min={0}
          max={3}
          step={1}
          radius={36}
          color="#ffffff"
          label={`I: ${this._getLabel(this.props.model.looper.instrument)}`}
          onChange={i => (this.props.model.looper.instrument = i)}
        />
        <SequencerKeyboard model={this.props.model} />
      </EffectUnit>
    );
  }

  private _getLabel = (i: number) => {
    return ["BD", "OH", "CH", "SD"][i];
  };
}

interface ISequencerDisplayProps {
  model: SqcrModel;
}

@observer
class SequencerKeyboard extends React.Component<ISequencerDisplayProps> {
  render() {
    return (
      <div className="squid-sequencer-keyboard">
        {Array(16)
          .fill(null)
          .map((_, i) => (
            <KeyboardButton key={Math.random()} idx={i} {...this.props} />
          ))}
      </div>
    );
  }
}

interface IButtonProps {
  theme?: any;
  isRegistered: boolean;
}

const Button = styled.div`
  position: relative;
  border-radius: 5px;
  border: 1px solid;
  height: 28px;
  width: 28px;
  border-color: ${p => p.theme.color.white};
  cursor: pointer;

  .keyboard-button-indicator {
    --indicator-color: ${(p: IButtonProps) => {
      return p.isRegistered ? p.theme.color.red : p.theme.color.white;
    }};

    position: absolute;
    top: 3px;
    right: 3px;

    height: 7px;
    width: 7px;
    border-radius: 50%;
    background-color: var(--indicator-color);
    box-shadow: 0px 0px 2px 0px var(--indicator-color);
  }
`;

interface IKeyboardButtonProps {
  idx: number;
  model: SqcrModel;
}

@observer
class KeyboardButton extends React.Component<IKeyboardButtonProps> {
  render() {
    const isRegistered = this.props.model.looper.registered[this.props.idx].has(
      this.props.model.looper.instrument
    );

    return (
      <Button
        className="keyboard-button"
        onClick={() => this.props.model.looper.toggleNote(this.props.idx)}
        isRegistered={
          isRegistered || this.props.model.looper.position === this.props.idx
        }
      >
        <div className="keyboard-button-indicator" />
      </Button>
    );
  }
}

// --- styled

const Sequencer = styled(SequencerBase)`
  --unit-width: 512px;

  height: 120px;
  width: var(--unit-width);

  .squid-sequencer-keyboard {
    position: absolute;
    bottom: 0;

    display: flex;
    flex-direction: row;
    justify-content: space-around;

    margin-top: 20px;
    height: 30px;
    width: var(--unit-width);
  }
`;

/**
 * Plugin definition.
 */
const options = {
  id: "squidoriginals:sequencer",
  name: "Sequencer",
  model: SqcrModel
};

export default plugin.register(Sequencer, options);
