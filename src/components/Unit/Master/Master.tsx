import * as React from "react";
import { observer } from "mobx-react";

import { plugin } from "../../../lib/core";
import { Button } from "../../Element/Button";
import { Slider } from "../../Element/Slider";
import { WaveForm } from "../../Element/Waveform";
import { EffectUnit } from "../../EffectUnit";

import "./Master.css";
import { MasterModel } from "./Master.store";

interface IMasterProps {
  model: MasterModel;
}

/**
 * Main application page component.
 */
@observer
class Master extends React.Component<IMasterProps> {
  componentWillUnmount() {
    console.log("should really dispose!");
  }

  /**
   * handles start button.
   * @param {HTMLClickEvent} e click event
   */
  _handleButton = (_: any) => {
    this.props.model.mute = !this.props.model.mute;
  };

  /**
   * handle volume changes.
   */
  _onVolumeChange = (_: any, value: number) => {
    this.props.model.volume = value;
  };

  render() {
    const { model } = this.props;
    const buttonType = model.mute ? "active" : "inactive";

    return (
      <EffectUnit model={model.unit} className="squid-master-unit">
        <WaveForm
          className="squid-master-waveform"
          analyser={model._analyser}
        />

        <Button
          className="squid-master-mute"
          type={buttonType}
          shape="round"
          onClick={this._handleButton}
        >
          {model.mute ? "UNM" : "M"}
        </Button>

        <Slider
          min={-60}
          max={0}
          step={1}
          value={model.volume}
          onChange={this._onVolumeChange}
        />
      </EffectUnit>
    );
  }
}

/**
 * Plugin definition.
 */
const options = {
  id: "squidoriginals:master",
  name: "Master",
  model: MasterModel
};

export default plugin.register(Master, options);
