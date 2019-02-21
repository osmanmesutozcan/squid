import * as Tone from "tone";
import { observable, computed, action } from "mobx";

import { DockStore } from "../../Dock";
import { UnitInput, EffectUnitStore, IEffectUnitStore } from "../../EffectUnit";

export class DelayModel extends EffectUnitStore implements IEffectUnitStore {
  /**
   * Master output audio node.
   */
  private _delay: Tone.FeedbackDelay;

  /**
   * Length of the delay.
   */
  @observable
  _delayTime = 0.2;

  @action
  setDelayTime = (value: number) => {
    this._delay.delayTime.value = value;
    this._delayTime = value;
  };
  @computed
  get delayTime(): number {
    return this._delayTime;
  }
  set delayTime(value: number) {
    this.setDelayTime(value);
  }

  /**
   * wetness
   */
  @observable
  _wet = 0.4;

  @action
  setWet = (value: number) => {
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
  setFeedback = (value: number) => {
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

  constructor(store: DockStore) {
    super(store);

    this._delay = new Tone.FeedbackDelay({
      delayTime: this.delayTime,
      feedback: this.feedback,
      wet: this.wet
    });

    this.inputs[0] = new UnitInput(this, this._delay);
    this.outputs[0] = new UnitInput(this, this._delay);
  }

  dispose = () => {
    this._delay.dispose();
  };
}
