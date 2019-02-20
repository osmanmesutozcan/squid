import React from "react";
import { observer, inject } from "mobx-react";

import "./BottomPanel.css";
import { Drawer } from "./Element/Drawer";

/**
 * Effect Unit explorer side panel area.
 */
@inject("store")
@observer
export default class BottomPanel extends React.Component {
  render() {
    return (
      <Drawer position="bottom">
        <div className="squid-main-sidepanel-container">
          <div className="squid-main-sidepanel-inner" />
        </div>
      </Drawer>
    );
  }
}
