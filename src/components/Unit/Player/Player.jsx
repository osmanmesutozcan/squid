import React from "react";
import { observable, action } from "mobx";
import { observer } from "mobx-react";
import Tone from "tone";

import { plugin } from "../../../lib/core";
import EffectUnit, { EffectUnitModel, UnitInput } from "../../EffectUnit";
import util from "../../../lib/util";
import "./Player.css";

const CLIENT_ID = "client_id=YeB1O6rbKc9vlNIbA4ghoAxzOoGLK6fZ";
const STREAM_SRC = source => `${source}?${CLIENT_ID}`;
const SOUNDCLOUD_RESOLVE = perma =>
  `https://api.soundcloud.com/resolve.json?url=${perma}&${CLIENT_ID}`;

/**
 * Oscillator unit main model.
 */
class PlayerModel {
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
   * Audio source node.
   */
  _source = null;

  _player = null;

  constructor(store, uuid = util.uuid()) {
    this.uuid = uuid;
    this.store = store;

    this.unit = new EffectUnitModel(this);
  }

  init = player => {
    this._player = player;
    this._source = Tone.context.createMediaElementSource(this._player);
    this.outputs[0] = new UnitInput(this, this._source, {});
  };

  dispose = () => {
    this._source.dispose();
  };
}

/**
 * Main application page component.
 */
@observer
class Player extends React.Component {
  @observable
  keyword = "";

  /**
   * Take player node and init model.
   */
  init = node => {
    this.props.model.init(node);
  };

  componentWillUnmount() {
    this.props.model.dispose();
  }

  /**
   * Handle a source search.
   */
  @action.bound
  _onSearch(e) {
    e.preventDefault();
    fetch(SOUNDCLOUD_RESOLVE(this.keyword))
      .then(res => res.json())
      .then(data => {
        if (!data.stream_url || !data.streamable) {
          return;
        }

        this.setState({
          source: STREAM_SRC(data.stream_url)
        });

        this.props.model._player.src = STREAM_SRC(data.stream_url);
      });
  }

  @action.bound
  _handleFormChange(e) {
    this.keyword = e.target.value;
  }

  render() {
    return (
      <EffectUnit model={this.props.model.unit} className="squid-player-unit">
        <form onSubmit={this._onSearch.bind(this)}>
          <input
            type="text"
            autoComplete="off"
            name="playerSource"
            value={this.keyword || ""}
            onChange={this._handleFormChange.bind(this)}
          />
        </form>

        <audio ref={this.init} controls crossOrigin="true">
          <source src={this.props.model.source} />
        </audio>
      </EffectUnit>
    );
  }
}

/**
 * Plugin definition.
 */
const options = {
  id: "squidoriginals:player",
  name: "Player",
  model: PlayerModel
};

export default plugin.register(Player, options);
