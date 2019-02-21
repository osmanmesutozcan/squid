import * as React from "react";
import { observer } from "mobx-react";

import { plugin } from "../../../lib/core";
import { EffectUnit } from "../../EffectUnit";

import "./Recorder.css";
import { RecorderModel } from "./Recorder.store";
import { Button } from "../../Element/Button";

interface IRecorderProps {
  model: RecorderModel;
}

/**
 * Main application page component.
 */
@observer
class Recorder extends React.Component<IRecorderProps> {
  componentWillUnmount() {
    this.props.model.dispose();
  }

  render() {
    return (
      <EffectUnit model={this.props.model} className="squid-recorder-unit">
        <Button
          className="squid-recordunit-start"
          type="active"
          shape="round"
          onClick={this.props.model.play}
        >
          Play
        </Button>

        <Button
          className="squid-recordunit-start"
          type={this.props.model.isRecording ? "active" : "inactive"}
          shape="round"
          onClick={this.props.model.toggle}
        >
          {this.props.model.isRecording ? "STOP" : "START"}
        </Button>
      </EffectUnit>
    );
  }
}

/**
 * Plugin definition.
 */
const options = {
  id: "squidoriginals:recorder",
  name: "Recorder",
  model: RecorderModel
};

export default plugin.register(Recorder, options);
