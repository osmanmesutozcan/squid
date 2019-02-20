import * as React from "react";
import * as uuid from "uuid";
import { observer, inject } from "mobx-react";

import "./Dock.css";
import { Metronom } from "./Main/Metronom";
import { Root } from "../stores/root.store";

/**
 * Data store for dock items.
 */
export class DockStore {
  /**
   * Unique id.
   */
  id = uuid();

  /**
   * Parent data store.
   */
  root: typeof Root;

  /**
   * Main overlay svg layer.
   */
  _svg: SVGSVGElement | null = null;

  constructor(store: typeof Root) {
    this.root = store;
  }
}

interface IOverlayProps {
  store?: typeof Root;
  model: DockStore;
}

/**
 * Overlay layer to draw connections between nodes.
 */
@inject("store")
@observer
class Overlay extends React.Component<IOverlayProps> {
  componentDidMount() {
    let dock = document.getElementById("squid-main-dock-area")!;
    const svg = this.props.store!.dock._svg!;

    // match overlay position, offset to dock.
    svg.style.width = dock.clientWidth.toString();
    svg.style.height = dock.clientHeight.toString();
  }

  render() {
    return (
      <svg
        ref={n => (this.props.store!.dock._svg = n)}
        id="squid-overlay-main"
        className="squid-overlay-main"
      />
    );
  }
}

interface IDockProps {
  store?: typeof Root;
  model?: DockStore;
}

/**
 * Effect Unit docking area.
 */
@inject("store")
@observer
export class Dock extends React.Component<IDockProps> {
  _mainArea: HTMLDivElement | null = null;
  _containerArea: HTMLDivElement | null = null;

  _isDragging = false;
  // keep track of initial click position
  // so we can calculate delta on mouse move.
  _clickPos = {
    x: 0,
    y: 0
  };
  // current drag position
  _dragPos = {
    x: 0,
    y: 0
  };

  componentDidMount() {
    const container = this._containerArea!;
    container.addEventListener("mousedown", this._handleMouseDown);
    container.addEventListener("mouseup", this._handleMouseUp);
    container.addEventListener("mousemove", this._handleMouseMove);
  }

  componentWillUnmount() {
    const container = this._containerArea!;
    container.removeEventListener("mousedown", this._handleMouseDown);
    container.removeEventListener("mouseup", this._handleMouseUp);
    container.removeEventListener("mousemove", this._handleMouseMove);
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
          {this.props.store!.active.map(p => {
            return React.cloneElement(p.component, {
              key: p.component.props.model.uuid
            });
          })}

          <Metronom />
          <Overlay model={this.props.model!} />
        </div>
      </div>
    );
  }

  /**
   * Handle main area drag
   */
  _handleMouseMove = (e: MouseEvent) => {
    if (!this._isDragging) {
      return;
    }

    const deltaX = this._clickPos.x - e.screenX;
    const deltaY = this._clickPos.y - e.screenY;

    const container = this._containerArea!;
    container.scrollLeft = deltaX + this._dragPos.x;
    container.scrollTop = deltaY + this._dragPos.y;
  };

  _handleMouseDown = (e: MouseEvent) => {
    if (e.target !== this._mainArea) {
      return;
    }

    this._isDragging = true;
    this._clickPos = {
      x: e.screenX,
      y: e.screenY
    };

    this._mainArea!.style.cursor = "grabbing";
  };

  _handleMouseUp = (e: MouseEvent) => {
    const container = this._containerArea!;

    this._isDragging = false;
    this._mainArea!.style.cursor = "grab";

    this._dragPos = {
      x: container.scrollLeft,
      y: container.scrollTop
    };
  };
}
