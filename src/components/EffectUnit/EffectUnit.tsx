import * as React from "react";
import { observer, inject } from "mobx-react";
import Draggable from "react-draggable";

import { classname } from "../../util/attributes";
import { IPosition } from "../../lib/position";
import { Root } from "../../stores/root.store";

import "./EffectUnit.css";
import { UnitInput } from "./UnitInput.store";
import { EffectUnitModel } from "./EffectUnit.store";
import { Inputs, Output } from "./UnitInput";

interface IEffectUnitProps {
  className?: string;

  store?: typeof Root;

  model: EffectUnitModel;
}

/**
 * Higher order draggable component.
 */
@inject("store")
@observer
export class EffectUnit extends React.Component<IEffectUnitProps> {
  componentDidMount() {
    window.addEventListener("mousemove", Private.onmousemove);
    window.addEventListener("click", Private.onclick);
  }

  componentWillUnmount() {
    window.removeEventListener("mousemove", Private.onmousemove);
    window.removeEventListener("click", Private.onclick);
  }

  /**
   * Mutate state on drag event.
   */
  handleDrag = (_: any, position: IPosition) => {
    this.props.model.updatePosition({
      x: position.x,
      y: position.y
    });
  };

  /**
   * Deactivate a unit.
   */
  deactivate = () => {
    this.props.store!.deactivate(this.props.model.store.uuid);
  };

  render() {
    const className = classname([this.props.className!, "squid-effectunit"]);

    return (
      <Draggable
        position={this.props.model.position}
        grid={[10, 10]}
        handle=".squid-effectunit-header"
        onDrag={this.handleDrag}
      >
        <div className="squid-effectunit-container">
          <div className={className}>
            {/* header bar */}
            <div className="squid-effectunit-header">
              <span
                className="squid-effectunit-close"
                onClick={this.deactivate}
              />
            </div>

            {// render INPUT nodes
            this.props.model.store.inputs.length > 0 ? (
              <Inputs model={this.props.model} />
            ) : null}

            {// render OUTPUT nodes
            this.props.model.store.outputs.length > 0 ? (
              <Output model={this.props.model} />
            ) : null}

            {this.props.children}
          </div>
        </div>
      </Draggable>
    );
  }
}

/**
 * Module private statics.
 */
export class Private {
  private constructor() {}

  /**
   * Temporary input.
   */
  static currentInput: UnitInput | null = null;

  /**
   * Referance to the main overlay area.
   * Used to calculate offset position.
   */
  static _overlay: HTMLElement | null = null;

  static getOverlay(): HTMLElement {
    if (!Private._overlay) {
      Private.setOverlay(document.getElementById("squid-overlay-main")!);
    }

    return Private._overlay!;
  }

  static setOverlay(value: HTMLElement) {
    Private._overlay = value;
  }

  static readjustPosition(position: IPosition, offset: IPosition) {
    return {
      x: position.x + offset.x,
      y: position.y + offset.y
    };
  }

  /**
   * Handle temporary path events.
   */
  static onmousemove(e: MouseEvent) {
    if (Private.currentInput) {
      let p = Private.currentInput.path!;

      let iP = Private.readjustPosition(
        Private.currentInput.position,
        Private.currentInput.offset
      );

      let oP = { x: e.offsetX, y: e.offsetY };
      let s = Private.createPath(iP, oP);
      p.setAttributeNS(null, "d", s);
    }
  }

  /**
   * Handle temporary path events.
   */
  static onclick(e: MouseEvent) {
    if (Private.currentInput) {
      if (Private.currentInput.connection) {
        // disconnect the audio node if
        // clicked somewhere other than the unit
        // output.
        Private.currentInput.connection.disconnect(Private.currentInput);
      }

      Private.currentInput.path!.removeAttribute("d");
      Private.currentInput = null;
    }
  }

  /**
   * create a path between two locations
   * @param a start point of the path
   * @param b end point of the path
   */
  static createPath(a: IPosition, b: IPosition) {
    var diff = {
      x: b.x - a.x,
      y: b.y - a.y
    };

    var path = "M" + a.x + "," + a.y + " ";
    path += "C";
    path += a.x + (diff.x / 3) * 2 + "," + a.y + " ";
    path += a.x + diff.x / 3 + "," + b.y + " ";
    path += b.x + "," + b.y;

    return path;
  }
}
