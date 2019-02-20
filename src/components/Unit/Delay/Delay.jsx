import React from "react";
import { observable, computed, action } from "mobx";
import { observer } from "mobx-react";
import Tone from "tone";

import { plugin } from "../../../lib/core";
import util from "../../../lib/util";
import EffectUnit, { EffectUnitModel, UnitInput } from "../../EffectUnit";
import Slider from "../../Element/Slider";
import "./Delay.css";

class DelayModel {
  /**
   * Unique id of the unit
   */
  uuid = null;

  /**
   * Effect unit core.
   */
  unit = null;

  /**
   * Parent data store.
   */
  store = null;

  /**
   * Output count of the unit.
   */
  output = 1;

  /**
   * Input count of the unit.
   */
  input = 1;

  /**
   * Output audio stores.
   */
  outputs = [];

  /**
   * Input audio stores.
   */
  inputs = [];

  /**
   * Length of the delay.
   */
  @observable
  _delayTime = 0.2;

  @action
  setDelayTime = value => {
    this._delay.delayTime.value = value;
    this._delayTime = value;
  };
  @computed
  get delayTime() {
    return this._delayTime;
  }
  set delayTime(value) {
    this.setDelayTime(value);
  }

  /**
   * wetness
   */
  @observable
  _wet = 0.4;

  @action
  setWet = value => {
    this._delay.wet.value = value;
    this._wet = value;
  };
  @computed
  get wet() {
    return this._wet;
  }
  set wet(value) {
    this.setWet(value);
  }

  /**
   * Amount of the output the is feed back into the
   * input.
   */
  @observable
  _feedback = 0.3;

  @action
  setFeedback = value => {
    this._delay.feedback.value = value;
    this._feedback = value;
  };
  @computed
  get feedback() {
    return this._feedback;
  }
  set feedback(value) {
    this.setFeedback(value);
  }

  /**
   * Master output audio node.
   */
  _delay = null;

  constructor(store, uuid = util.uuid()) {
    this.uuid = uuid;
    this.store = store;

    this._delay = new Tone.FeedbackDelay({
      delayTime: this.delayTime,
      feedback: this.feedback,
      wet: this.wet
    });

    // input #1 is the master.
    this.unit = new EffectUnitModel(this);
    this.inputs[0] = new UnitInput(this, this._delay, {
      offset: {
        x: 0,
        y: 27.5
      }
    });

    this.outputs[0] = new UnitInput(this, this._delay, {
      offset: {
        x: 100,
        y: 27.5
      }
    });
  }
}

/**
 * Delay unit.
 */
@observer
class Delay extends React.Component {
  /**
   * handle volume changes.
   */
  _onDelayChange = (e, value) => {
    this.props.model.delayTime = value;
  };

  /**
   * handle volume changes.
   */
  _onFeedbackChange = (e, value) => {
    this.props.model.feedback = value;
  };

  /**
   * handle volume changes.
   */
  _onWetChange = (e, value) => {
    this.props.model.wet = value;
  };

  render() {
    const { model } = this.props;

    return (
      <EffectUnit model={model.unit} className="squid-delay-unit">
        <div className="squid-delay-unit-inner">
          <Slider
            className="squid-delay-slider"
            min={0}
            max={1}
            step={0.001}
            value={model.delayTime}
            onChange={this._onDelayChange}
          />

          <Slider
            className="squid-delay-slider"
            min={0}
            max={1}
            step={0.01}
            value={model.wet}
            onChange={this._onWetChange}
          />

          <Slider
            className="squid-delay-slider"
            min={0}
            max={1}
            step={0.01}
            value={model.feedback}
            onChange={this._onFeedbackChange}
          />
        </div>
      </EffectUnit>
    );
  }
}

/**
 * Plugin definition.
 */
const options = {
  id: "squidoriginals:delay",
  name: "Delay",
  model: DelayModel
};

export default plugin.register(Delay, options);
