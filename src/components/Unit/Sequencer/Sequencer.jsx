import React from "react";
import Tone from "tone";
import { observable, action, reaction } from "mobx";

import { plugin } from "../../../lib/core";
import util from "../../../lib/util";
import EffectUnit, { EffectUnitModel, UnitInput } from "../../EffectUnit";
import "./Sequencer.css";
import { observer } from "mobx-react";

/**
 * Sequencer unit main model.
 */
class SequencerModel {
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
   * Display model.
   */
  display = null;

  /**
   * Output count of the unit.
   */
  output = 1;

  /**
   * Input count of the unit.
   */
  input = 0;

  /**
   * Output audio nodes.
   */
  outputs = [];

  /**
   * Input audio nodes.
   */
  inputs = [];

  /**
   * Synth audio node.
   */
  _synth = new Tone.Synth({
    oscillator: {
      type: "triangle"
    },
    envelope: {
      attack: 0.005,
      decay: 0.1,
      sustain: 0.3,
      release: 1
    }
  });

  constructor(store, uuid = util.uuid()) {
    this.uuid = uuid;
    this.store = store;

    this.display = new DisplayModel(this);
    this.unit = new EffectUnitModel(this);
    this.outputs[0] = new UnitInput(this, this._synth, {
      offset: {
        x: 100,
        y: 27.5
      }
    });

    this._disposeOnMIDILayoutDown = this.store.store.keyboard.onMIDILayoutDown(
      this._handleMIDIKeysDown
    );
    this._disposeOnMIDILayoutUp = this.store.store.keyboard.onMIDILayoutUp(
      this._handleMIDIKeysUp
    );
  }

  // --- Record
  _keydownMap = new Map();
  _handleMIDIKeysDown = e => {
    if (this._keydownMap.has(e.note)) {
      return;
    }

    this._keydownMap.set(e.note);
    this._synth.triggerAttack(e.note);
  };
  _handleMIDIKeysUp = e => {
    this._keydownMap.delete(e.note);
    this._synth.triggerRelease();
  };

  // --- Playback
  // ...

  // Keyboard event disposables
  _disposeOnMIDILayoutDown;
  _disposeOnMIDILayoutUp;

  dispose = () => {
    this._synth.dispose();
    this._disposeOnMIDILayoutDown();
    this._disposeOnMIDILayoutUp();
  };
}

class DisplayModel {
  @observable position = 0;

  @action
  setPosition = position => {
    this.position = position % 16;
  };

  constructor() {
    this.loop = new Tone.Loop(() => {
      this.setPosition(this.position + 1);
    }, "16n");

    this.loop.start(0);
  }
}

/**
 * 1 bar 16 step sequencer.
 */
@observer
class Sequencer extends React.Component {
  componentWillUnmount() {
    this.props.model.dispose();
  }

  /**
   * Slowly reduce the volume on end drag
   * so it won't make clicky noises.
   */
  _endDrag = () => {
    this.props.model._oscillator.volume.rampTo(-Infinity, 0.05);
  };

  render() {
    return (
      <EffectUnit
        model={this.props.model.unit}
        className="squid-sequencer-unit"
      >
        <SequencerDisplay model={this.props.model} />
      </EffectUnit>
    );
  }
}

@observer
class SequencerDisplay extends React.Component {
  _displayArea = null;

  componentWillUnmount() {
    this._updatePositionDisposable();
  }

  render() {
    const pos = (200 / 16) * this.props.model.display.position;
    const indicatorPosition = {
      x1: pos,
      x2: pos,

      y1: 0,
      y2: 100
    };

    return (
      <svg
        ref={node => (this._displayArea = node)}
        className="squid-sequencer-display"
      >
        <line
          {...indicatorPosition}
          className="squid-sequencer-display-position-indicator"
        />
      </svg>
    );
  }
}

/**
 * Plugin definition.
 */
const options = {
  id: "squidoriginals:sequencer",
  name: "Sequencer",
  model: SequencerModel
};

export default plugin.register(Sequencer, options);
