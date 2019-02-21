import * as React from "react";
import { observer } from "mobx-react";
import { observable, action } from "mobx";

import { plugin } from "../../../lib/core";
import { EffectUnit } from "../../EffectUnit";

import "./Player.css";
import { PlayerModel } from "./Player.store";

interface IPlayerProps {
  model: PlayerModel;
}

/**
 * Main application page component.
 */
@observer
class Player extends React.Component<IPlayerProps> {
  @observable private _keyword = "";

  private _audio: HTMLAudioElement | null = null;

  componentDidMount() {
    this.props.model.init(this._audio!);
  }

  componentWillUnmount() {
    this.props.model.dispose();
  }

  render() {
    return (
      <EffectUnit model={this.props.model} className="squid-player-unit">
        <form
          onSubmit={e => {
            e.preventDefault();
            this._onSearch();
          }}
        >
          <input
            type="text"
            autoComplete="off"
            name="playerSource"
            value={this._keyword}
            onChange={action((e: any) => (this._keyword = e.target.value))}
          />
        </form>

        <audio ref={n => (this._audio = n)} controls crossOrigin="true">
          <source src={this.props.model.source} />
        </audio>
      </EffectUnit>
    );
  }

  /**
   * Handle a source search.
   */
  _onSearch = () => {
    this.props.model.search(this._keyword);
  };

  /**
   * Take player node and init model.
   */
  init = (node: HTMLAudioElement) => {
    this.props.model.init(node);
  };
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
