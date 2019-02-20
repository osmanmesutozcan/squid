import React from "react";
import { observable, action, reaction } from "mobx";
import { observer, inject } from "mobx-react";
import Tone from "tone";

import "./Metronom.css";

class MetronomModel {
  /**
   * Metronom running or not.
   */
  @observable running = false;
  @action
  toggle = () => {
    this.running = !this.running;
    if (this.running) {
      Tone.Transport.start();
    } else {
      Tone.Transport.stop();
    }
  };

  /**
   * Mouse hint state.
   */
  @observable hint = false;

  constructor(root) {
    let player = new Tone.Player(
      "https://freesound.org/data/previews/268/268822_4486188-lq.mp3"
    ).toMaster();

    Tone.Transport.bpm.value = root.playback._bpm;

    // Tone.Transport.scheduleRepeat(time => {
    //   player.start(time);
    // }, "4n");

    reaction(() => root.playback._bpm, bpm => (Tone.Transport.bpm.value = bpm));
  }
}

@observer
class Display extends React.Component {
  /**
   * Start/Stop metronom
   */
  _toggle = () => {
    this.props.model.toggle();
  };

  /**
   * Referance to the display element.
   */
  _container = null;

  onscroll = e => {
    let temp = this.props.store.playback._bpm - Math.round(e.deltaY / 75);

    if (temp > 0) {
      this.props.store.playback._bpm = temp;
    }

    if (this.props.model.hint) {
      this.props.model.hint = false;
    }
  };

  componentDidMount() {
    this._container.addEventListener("mousewheel", this.onscroll);
  }

  render() {
    const cn = this.props.model.running ? " active" : "";

    return (
      <div
        ref={n => (this._container = n)}
        onClick={this._toggle}
        className={cn + " metronom-display"}
      >
        <h2>{this.props.store.playback._bpm}</h2>
      </div>
    );
  }
}

@inject("store")
@observer
class Metronom extends React.Component {
  model = new MetronomModel(this.props.store);

  render() {
    return <Display model={this.model} store={this.props.store} />;
  }
}

export default Metronom;
