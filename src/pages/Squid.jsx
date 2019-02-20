import React from "react";
import { observable } from "mobx";
import { observer } from "mobx-react";

import { SquidProvider, plugin } from "../lib/core";
import Dock from "../components/Dock";
import SidePanel from "../components/SidePanel";
import BottomPanel from "../components/BottomPanel";
import "./Squid.css";

import Master from "../components/Unit/Master";
import Player from "../components/Unit/Player";
import Delay from "../components/Unit/Delay";
import Microfon from "../components/Unit/Microfon";
import Oscillator from "../components/Unit/Oscillator";
import Sequencer from "../components/Unit/Sequencer";

// activate plugins
plugin.use([Master, Player, Delay, Microfon, Oscillator, Sequencer]);

/**
 * Main application state store.
 */
class SquidStore {
  @observable test = {};
}

/**
 * Main application page component.
 */
@observer
class Squid extends React.Component {
  render() {
    return (
      <SquidProvider className="squid-main-application-container">
        <SidePanel />
        <BottomPanel />
        <Dock />
      </SquidProvider>
    );
  }
}

export default Squid;
export { SquidStore };
