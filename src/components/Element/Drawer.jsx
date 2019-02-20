import React from "react";
import { observable } from "mobx";
import { observer } from "mobx-react";

import { classname } from "../../util/attributes";
import "./Drawer.css";

/**
 * Slider UI Element.
 */
@observer
export class Drawer extends React.Component {
  @observable
  _isOpened = false;

  render() {
    let position = this.props.position;

    let className = classname([
      `squid-drawer-${position} ${
        this._isOpened ? "" : `squid-drawer-${position}-closed`
      }`,
      this.props.className
    ]);

    let contentClassName = `squid-drawer-content squid-drawer-content-${position} ${
      this._isOpened ? "" : `squid-drawer-content-${position}-closed`
    }`;

    return (
      <React.Fragment>
        <div className={className} {...this.props}>
          <div className={contentClassName}>{this.props.children}</div>
          <div
            className={`squid-drawer-toggle squid-drawer-toggle-${position}`}
            onClick={this._toggle}
          />
        </div>
      </React.Fragment>
    );
  }

  _toggle = e => {
    this._isOpened = !this._isOpened;

    if (this._isOpened) {
      if (this.props.onOpen) {
        this.props.onOpen(e);
      }
    } else {
      if (this.props.onClose) {
        this.props.onClose(e);
      }
    }
  };
}
