import * as React from "react";
import { observer, inject } from "mobx-react";

import "./SidePanel.css";
import { Drawer } from "./Element/Drawer";
import { Root } from "../stores/root.store";

/**
 * Single explorer card to display plugin information.
 */
interface ISidePanelCard {
  name: string;
  plugin: any;
  store?: typeof Root;
}

@inject("store")
@observer
class SidePanelCard extends React.Component<ISidePanelCard> {
  activate = () => {
    const { plugin } = this.props;
    this.props.store!.activate(plugin);
  };

  render() {
    return (
      <div onClick={this.activate} className="squid-sidepanel-card">
        <h3>{this.props.name}</h3>
      </div>
    );
  }
}

interface ISidePanel {
  store?: typeof Root;
}

/**
 * Effect Unit explorer side panel area.
 */
@inject("store")
@observer
export class SidePanel extends React.Component<ISidePanel> {
  render() {
    const { opted } = this.props.store!;

    return (
      <Drawer position="side">
        <div className="squid-main-sidepanel-container">
          <div className="squid-main-sidepanel-inner">
            {Object.keys(opted).map((p, idx) => (
              <SidePanelCard
                key={idx}
                name={opted[p].options.name}
                plugin={opted[p]}
              />
            ))}
          </div>
        </div>
      </Drawer>
    );
  }
}
