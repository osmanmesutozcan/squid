import * as React from "react";
import { observer } from "mobx-react";

import { EffectUnit } from "../../EffectUnit";
import { plugin } from "../../../lib/core";
import { Button } from "../../Element/Button";
import { WaveForm } from "../../Element/Waveform";

import "./Microfon.css";
import { MicrofonModel } from "./Microfon.store";

interface IMicrofonProps {
  model: MicrofonModel;
}

/**
 * Main application page component.
 */
@observer
class Microfon extends React.Component<IMicrofonProps> {
  componentDidMount() {
    this.props.model.init();
  }

  componentWillUnmount() {
    this.props.model.dispose();
  }

  render() {
    const { model } = this.props;

    const buttonType = model.opened ? "active" : "inactive";

    return (
      <EffectUnit model={model.unit} className="squid-microfon-unit">
        <WaveForm
          className="squid-microfonunit-waveform"
          analyser={model.analyser}
        />

        <Button
          className="squid-microfonunit-start"
          type={buttonType}
          shape="round"
          onClick={this._toggleMic}
        >
          {model.opened ? "STOP" : "START"}
        </Button>
      </EffectUnit>
    );
  }

  private _toggleMic = () => {
    if (this.props.model.opened) {
      this.props.model.close();
    } else {
      this.props.model.open();
    }
  };
}

/**
 * Plugin definition.
 */
const options = {
  id: "squidoriginals:microfon",
  name: "Microfon",
  model: MicrofonModel
};

export default plugin.register(Microfon, options);
