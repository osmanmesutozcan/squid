import * as React from "react";
import { observer } from "mobx-react";

import { EffectUnitModel } from "./EffectUnit.store";

interface IInputProps {
  idx: number;
  model: EffectUnitModel;
}

@observer
class Input extends React.Component<IInputProps> {
  onclick = (e: React.MouseEvent<HTMLSpanElement, MouseEvent>) => {
    this.props.model.store.inputs[this.props.idx].inputonclick(e);
  };

  render() {
    return (
      <div
        data-uuid={this.props.model.store.uuid}
        onClick={this.onclick}
        className="squid-effectunit-connection squid-effectunit-input"
      />
    );
  }
}

interface IInputsProps {
  model: EffectUnitModel;
}

/**
 * Collection of inputs on a node.
 */
@observer
export class Inputs extends React.Component<IInputsProps> {
  render() {
    return (
      <div
        className="squid-effectunit-inputs-container"
        style={{ left: "-7px" }}
      >
        {this.props.model.store.inputs.map((_: any, idx: number) => (
          <Input key={Math.random()} idx={idx} model={this.props.model} />
        ))}
      </div>
    );
  }
}

interface IOutputProps {
  model: EffectUnitModel;
}

/**
 * Node output element.
 *
 * For now there can only be single output per unit.
 */
@observer
export class Output extends React.Component<IOutputProps> {
  onclick = (e: React.MouseEvent<HTMLSpanElement, MouseEvent>) => {
    // If needed multiple outputs this should be written
    // the same way as input is.
    this.props.model.store.outputs[0].outputonclick(e);
  };

  render() {
    const { outputs } = this.props.model.store;
    const className = `squid-effectunit-connection squid-effectunit-output ${
      outputs.length > 0 && outputs[0] && outputs[0].isConnected
        ? "squid-effectunit-connection-active"
        : ""
    }`;

    return (
      <div
        className="squid-effectunit-inputs-container"
        style={{ right: "-7px" }}
      >
        <span
          data-uuid={this.props.model.store.uuid}
          onClick={this.onclick}
          id={"outputnode:0"}
          className={className}
        />
      </div>
    );
  }
}
