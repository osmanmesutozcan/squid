import * as React from "react";

import "./Controller.css";
import { observable } from "mobx";
import { observer } from "mobx-react";

type EventTargetWithOffset = EventTarget & {
  offsetWidth: number;
  offsetHeight: number;
};

interface IDraggable {
  params: any;
  unit: any;

  // Runs when drag starts;
  start?: Function;
  // Runs when drag ends;
  end?: Function;

  onMouseUp?: Function;
  onMouseDown?: Function;
  onMouseMose?: Function;
}

/**
 * Draggable control area
 */
@observer
export class Draggable extends React.Component<IDraggable> {
  private _moving = false;

  componentDidMount() {
    document.addEventListener("mouseup", this._onMouseUp.bind(this));
  }

  componentWillUnmount() {
    document.removeEventListener("mouseup", this._onMouseUp.bind(this));
  }

  // helper to check if module was disposed.
  _wasDisposed = () => {
    if (
      !this.props.unit[this.props.params.x.param] ||
      !this.props.unit[this.props.params.y.param]
    ) {
      return true;
    }

    return false;
  };

  _onMouseUp = (e: MouseEvent) => {
    if (this.props.end && !this._wasDisposed()) {
      this.props.end();
    }

    if (this.props.onMouseUp) {
      this.props.onMouseUp(e);
    }

    this._moving = false;
  };

  _onMouseDown = (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
    if (this.props.start && !this._wasDisposed()) {
      this.props.start();
    }

    this._moving = true;
  };

  _onMouseMove = (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
    this._setValue(this.props.params.x.param, this._setX(e));
    this._setValue(this.props.params.y.param, this._setY(e));
  };

  /**
   * Set a value on a specified param of unit.
   * @param {String} param name of the parameter to set.
   * @param {String | Number} value new value of the param.
   */
  _setValue = (param: string, value: any) => {
    this.props.unit[param].value = value;
  };

  /**
   * Calculate X value according to params.
   */
  _setX = (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
    let params = this.props.params.x;

    let width = (e.target! as EventTargetWithOffset).offsetWidth;
    let posX = e.nativeEvent.offsetX;

    return ((params.max - params.min) / 100) * (posX / (width / 100));
  };

  /**
   * Calculate Y value according to params.
   */
  _setY = (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
    let params = this.props.params.y;

    let height = (e.target! as EventTargetWithOffset).offsetHeight;
    let posY = e.nativeEvent.offsetY;

    return ((params.max - params.min) / 100) * (posY / (height / 100));
  };

  render() {
    return (
      <div
        className="squid-draggable-area"
        onMouseMove={e => this._moving && this._onMouseMove(e)}
        onMouseDown={this._onMouseDown.bind(this)}
      />
    );
  }
}
