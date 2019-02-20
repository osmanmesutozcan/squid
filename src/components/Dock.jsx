import React from "react";
import { autorun } from "mobx";
import { observer, inject } from "mobx-react";

import util from "../lib/util";
import { Metronom } from "./Main";
import "./Dock.css";

/**
 * Data store for dock items.
 */
class DockStore {
  /**
   * Unique id.
   */
  id = null;

  /**
   * Parent data store.
   */
  store = null;

  /**
   * Main overlay svg layer.
   */
  _svg = null;

  constructor(store, id = util.uuid()) {
    this.id = id;
    this.store = store;

    autorun(() => {
      console.log(this._nodes);
    });
  }
}

/**
 * Overlay layer to draw connections between nodes.
 */
@inject("store")
@observer
class Overlay extends React.Component {
  componentDidMount() {
    let dock = document.getElementById("squid-main-dock-area");

    // match overlay position, offset to dock.
    this.props.store.dock._svg.style.width = dock.clientWidth;
    this.props.store.dock._svg.style.height = dock.clientHeight;
  }

  render() {
    return (
      <svg
        ref={n => (this.props.store.dock._svg = n)}
        id="squid-overlay-main"
        className="squid-overlay-main"
      />
    );
  }
}

/**
 * Effect Unit docking area.
 */
@inject("store")
@observer
class Dock extends React.Component {
  _mainArea = null;
  _containerArea = null;

  _isDragging = false;
  // keep track of initial click position
  // so we can calculate delta on mouse move.
  _clickPos = {
    x: undefined,
    y: undefined
  };
  // current drag position
  _dragPos = {
    x: 1000,
    y: 1000
  };

  componentDidMount() {
    this._containerArea.addEventListener("mousedown", this._handleMouseDown);
    this._containerArea.addEventListener("mouseup", this._handleMouseUp);
    this._containerArea.addEventListener("mousemove", this._handleMouseMove);

    // set initial position
    this._containerArea.scrollLeft = this._dragPos.x;
    this._containerArea.scrollTop = this._dragPos.y;
  }

  componentWillUnmount() {
    this._containerArea.removeEventListener("mousedown");
    this._containerArea.removeEventListener("mouseup");
    this._containerArea.removeEventListener("mousemove");
  }

  render() {
    return (
      <div
        ref={node => (this._containerArea = node)}
        id="squid-main-dock-container"
        className="squid-main-dock-container"
      >
        <div
          ref={node => (this._mainArea = node)}
          id="squid-main-dock-area"
          className="squid-main-dock-area"
        >
          {this.props.store.active.map(p => {
            return React.cloneElement(p.component, {
              key: p.component.props.model.uuid
            });
          })}

          <Metronom />
          <Overlay model={this.props.model} />
        </div>
      </div>
    );
  }

  /**
   * Handle main area drag
   */
  _handleMouseMove = e => {
    if (!this._isDragging) {
      return;
    }

    const deltaX = this._clickPos.x - e.screenX;
    const deltaY = this._clickPos.y - e.screenY;

    this._containerArea.scrollLeft = deltaX + this._dragPos.x;
    this._containerArea.scrollTop = deltaY + this._dragPos.y;
  };

  _handleMouseDown = e => {
    if (e.target !== this._mainArea) {
      return;
    }

    this._isDragging = true;
    this._clickPos = {
      x: e.screenX,
      y: e.screenY
    };

    this._mainArea.style.cursor = "grabbing";
  };

  _handleMouseUp = e => {
    this._isDragging = false;
    this._mainArea.style.cursor = "grab";
    this._dragPos = {
      x: this._containerArea.scrollLeft,
      y: this._containerArea.scrollTop
    };
  };
}

export default Dock;
export { DockStore };
