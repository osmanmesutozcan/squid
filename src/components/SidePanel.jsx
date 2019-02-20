import React from "react";
import { observer, inject } from "mobx-react";

import "./SidePanel.css";
import { Drawer } from "./Element/Drawer";

/**
 * Single explorer card to display plugin information.
 */
@inject("store")
@observer
class SidePanelCard extends React.Component {
  activate = () => {
    const { plugin } = this.props;
    this.props.store.activate(plugin);
  };

  render() {
    return (
      <div onClick={this.activate} className="squid-sidepanel-card">
        <h3>{this.props.name}</h3>
      </div>
    );
  }
}

/**
 * Effect Unit explorer side panel area.
 */
@inject("store")
@observer
class SidePanel extends React.Component {
  render() {
    const { opted } = this.props.store;
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

export default SidePanel;
