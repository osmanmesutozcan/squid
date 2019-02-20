import * as React from "react";
import { observable } from "mobx";
import { observer } from "mobx-react";

import { SquidProvider, plugin } from "../lib/core";
import { BottomPanel } from "../components/BottomPanel";
import { SidePanel } from "../components/SidePanel";
import { Dock } from "../components/Dock";
import "./Squid.css";

import * as Master from "../components/Unit/Master/Master";
import * as Player from "../components/Unit/Player/Player";
import * as Delay from "../components/Unit/Delay/Delay";
import * as Microfon from "../components/Unit/Microfon/Microfon";
import * as Oscillator from "../components/Unit/Oscillator/Oscillator";
import * as Sequencer from "../components/Unit/Sequencer/Sequencer";

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
class Squid extends React.Component<{ store: SquidStore }> {
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
