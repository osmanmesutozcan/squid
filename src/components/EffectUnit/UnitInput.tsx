import * as React from "react";
import { observer } from "mobx-react";

import { EffectUnitStore } from "./EffectUnit.store";
import { UnitInput } from "./UnitInput.store";

interface IOutputProps {
  idx: number;
  model: UnitInput;
}

@observer
class Input extends React.Component<IOutputProps> {
  render() {
    const cn = `squid-effectunit-connection squid-effectunit-input ${
      this.props.model.isConnected ? "squid-effectunit-connection-active" : ""
    }`;

    return (
      <div
        data-uuid={this.props.model.id}
        onClick={this.props.model.inputonclick}
        className={cn}
      />
    );
  }
}

interface IInputsProps {
  store: EffectUnitStore;
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
        {this.props.store.inputs.map((model: UnitInput, idx: number) => (
          <Input key={Math.random()} idx={idx} model={model} />
        ))}
      </div>
    );
  }
}

// --- OUTPUTS

interface IOutputProps {
  idx: number;
  model: UnitInput;
}

@observer
class Output extends React.Component<IOutputProps> {
  render() {
    const cn = `squid-effectunit-connection squid-effectunit-output ${
      this.props.model.isConnected ? "squid-effectunit-connection-active" : ""
    }`;

    return (
      <div
        data-uuid={this.props.model.id}
        onClick={this.props.model.outputonclick}
        className={cn}
      />
    );
  }
}

interface IOutputsProps {
  store: EffectUnitStore;
}

@observer
export class Outputs extends React.Component<IOutputsProps> {
  render() {
    return (
      <div
        className="squid-effectunit-inputs-container"
        style={{ right: "-7px" }}
      >
        {this.props.store.outputs.map((o: UnitInput, idx: number) => (
          <Output key={Math.random()} model={o} idx={idx} />
        ))}
      </div>
    );
  }
}
