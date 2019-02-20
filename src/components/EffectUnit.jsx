import React from "react";
import { observable, computed, action, reaction } from "mobx";
import { observer, inject } from "mobx-react";
import Draggable from "react-draggable";

import util from "../lib/util";
import { classname } from "../util/attributes";
import "./EffectUnit.css";

class EffectUnitModel {
  /**
   * Unique id for this unit.
   */
  uuid = null;

  /**
   * refers to owner Unit.
   */
  store = null;

  /**
   * Current position of this unit.
   */
  @observable
  _position = {
    x: 2000,
    y: 1500
  };

  @action
  updatePosition = position => {
    this._position = position;
    this.updateInputs(position);
    this.updateOutputs(position);
  };

  /**
   * update input nodes of the parent store.
   */
  updateInputs = position => {
    this.store.inputs.forEach(i => {
      i.update(position);
    });
  };

  /**
   * update output nodes of the parent store.
   */
  updateOutputs = position => {
    this.store.outputs.forEach(o => {
      o.update(position);
    });
  };

  @computed
  get position() {
    return this._position;
  }
  set position(position) {
    this.updatePosition(position);
  }

  // HELPERS
  /**
   * Checks if outputs is owned by its parent store.
   */
  owns = input => {
    for (let i = 0; i < this.store.inputs; i++) {
      if (this.store.outputs[i] === input) {
        return true;
      }
    }
  };

  constructor(store) {
    this.store = store;
    this.uuid = store.uuid;
  }
}

/**
 * Keep track of node inputs.
 */
class UnitInput {
  /**
   * Unique id
   */
  id = util.uuid();

  /**
   * Root store.
   */
  store = null;

  /**
   * this inputs path
   */
  path = null;

  /**
   * Audio node that input encapsulates to.
   */
  node = null;

  /**
   * Referance to the unit IO this IO is connected to.
   */
  connection = null;

  @computed
  get isConnected() {
    return this.connection !== null;
  }

  /**
   * Offset of the IO on
   * the uni.
   */
  offset = null;

  /**
   * position
   */
  @observable
  _position = {
    x: undefined,
    y: undefined
  };

  /**
   * update inputs position.
   */
  @action
  update = position => {
    this._position = Private.readjustPosition(
      this.store.unit.position,
      this.offset
    );
  };

  get position() {
    return this._position;
  }

  // OUTPUT NODE MOUSE EVENTS
  outputonclick = e => {
    if (Private.currentInput && !this.store.unit.owns(Private.currentInput)) {
      let tmp = Private.currentInput;
      Private.currentInput = null;
      this.connect(tmp);
    }
  };

  // INPUT NODE MOUSE EVENTS
  inputonclick = e => {
    if (Private.currentInput) {
      if (Private.currentInput.hasAttribute("d")) {
        Private.currentInput.removeAttribute("d");
      }
      if (Private.currentInput.connection) {
        Private.currentInput.connection.disconnect(Private.currentInput);
        Private.currentInput.connection = null;
      }
    }

    Private.currentInput = this;
    if (this.connection) {
      this.connection.disconnect(this);
    }
    e.stopPropagation();
  };

  updatePath = reaction(
    () => this._position,
    position => {
      if (!this.path || !this.connection) {
        return;
      }

      let iP = Private.readjustPosition(position, this.offset);
      let oP = Private.readjustPosition(
        this.connection.position,
        this.connection.offset
      );

      let s = Private.createPath(iP, oP);
      this.path.setAttributeNS(null, "d", s);
      this.connection.path.setAttributeNS(null, "d", s);
    }
  );

  /**
   * Connect another node's input into 'this'
   * output.
   */
  @action
  connect = input => {
    this.node.connect(input.node);
    // keep a referance to the connected
    // input.
    this.connection = input;
    input.connection = this;
  };

  /**
   * Disconnect 'this' output from
   * another node's input.
   */
  @action
  disconnect = input => {
    this.node.disconnect(input.node);
    // remove all referances
    this.connection = null;
    input.connection = null;
  };

  /**
   * node {AudioNode}
   * {
   *      offset {Object} -- offset of the IO relative to unit.
   * }
   */
  constructor(store, node, { offset = { x: 0, y: 0 } }) {
    if (!store.unit) {
      throw Error("Parent store does not have a unit assigned to it");
    }

    this.node = node;
    this.store = store;
    this.offset = offset;

    this.update();
    this.path = this.createElement();
    store.store._svg.appendChild(this.path);
  }

  createElement() {
    let path = document.createElementNS(
      this.store.store.store.dock._svg.namespaceURI,
      "path"
    );
    path.setAttributeNS(null, "stroke", "#FFFFFF");
    path.setAttributeNS(null, "stroke-width", "2");
    path.setAttributeNS(null, "fill", "none");

    return path;
  }
}

/**
 * Module private statics.
 */
class Private {
  /**
   * Referance to the main overlay area.
   * Used to calculate offset position.
   */
  static _overlay = null;
  static get overlay() {
    return Private._overlay
      ? Private._overlay
      : (Private.overlay = document.getElementById("squid-overlay-main"));
  }
  static set overlay(value) {
    Private._overlay = value;
  }

  /**
   * Temporary input.
   */
  static currentInput = null;

  static readjustPosition(position, offset) {
    return {
      x: position.x + offset.x,
      y: position.y + offset.y
    };
  }

  /**
   * Handle temporary path events.
   */
  static onmousemove(e) {
    if (Private.currentInput) {
      console.log(e);
      let p = Private.currentInput.path;

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
  static onclick(e) {
    if (Private.currentInput) {
      if (Private.currentInput.connection) {
        // disconnect the audio node if
        // clicked somewhere other than the unit
        // output.
        Private.currentInput.connection.disconnect(Private.currentInput);
      }

      Private.currentInput.path.removeAttribute("d");
      Private.currentInput = null;
    }
  }

  /**
   * create a path between two locations
   * @param a start point of the path
   * @param b end point of the path
   */
  static createPath(a, b) {
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

@observer
class Input extends React.Component {
  onclick = e => {
    this.props.model.store.inputs[this.props.idx].inputonclick(e);
  };

  render() {
    return (
      <span
        data-uuid={this.props.model.store.uuid}
        onClick={this.onclick}
        className="squid-effectunit-connection squid-effectunit-input"
      />
    );
  }
}

/**
 * Collection of inputs on a node.
 */
@observer
class Inputs extends React.Component {
  render() {
    return (
      <React.Fragment>
        {this.props.model.store.inputs.map((_, idx) => (
          <Input key={Math.random()} idx={idx} model={this.props.model} />
        ))}
      </React.Fragment>
    );
  }
}

/**
 * Node output element.
 *
 * For now there can only be single output per unit.
 */
@observer
class Output extends React.Component {
  onclick = e => {
    // If needed multiple outputs this should be written
    // the same way as input is.
    this.props.model.store.outputs[0].outputonclick(e);
  };

  render() {
    const { outputs } = this.props.model.store;
    const className = `squid-effectunit-connection squid-effectunit-output ${
      outputs.length > 0 && outputs[0] && outputs[0].isConnected
        ? "squid-effectunit-connection-active"
        : ""
    }`;

    return (
      <span
        data-uuid={this.props.model.store.uuid}
        onClick={this.onclick}
        id={"outputnode:0"}
        className={className}
      />
    );
  }
}

/**
 * Higher order draggable component.
 */
@inject("store")
@observer
class EffectUnit extends React.Component {
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
  handleDrag = (_, position) => {
    this.props.model.updatePosition({
      x: position.x,
      y: position.y
    });
  };

  /**
   * Deactivate a unit.
   */
  deactivate = () => {
    this.props.store.deactivate(this.props.model.store.uuid);
  };

  render() {
    const className = classname([this.props.className, "squid-effectunit"]);

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
            this.props.model.store.input > 0 ? (
              <Inputs index={0} model={this.props.model} />
            ) : null}

            {// render OUTPUT nodes
            this.props.model.store.output > 0 ? (
              <Output index={0} model={this.props.model} />
            ) : null}

            {this.props.children}
          </div>
        </div>
      </Draggable>
    );
  }
}

export default EffectUnit;
export { EffectUnitModel, UnitInput };
