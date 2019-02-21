import * as uuid from "uuid";
import * as Tone from "tone";
import { observable, computed, action, reaction } from "mobx";

import { IPosition } from "../../lib/position";
import { IEffectUnitStore } from "./EffectUnit.store";
import { Private } from "./EffectUnit";

/**
 * Keep track of node inputs.
 */
export class UnitInput {
  /**
   * Unique id
   */
  id = uuid();

  /**
   * Root store.
   */
  store: IEffectUnitStore;

  /**
   * this inputs path
   */
  path: SVGPathElement | null;

  /**
   * Audio node that input encapsulates to.
   */
  node: Tone.AudioNode | Tone.Master;

  /**
   * Referance to the unit IO this IO is connected to.
   */
  connection: UnitInput | null = null;

  @computed
  get isConnected() {
    return this.connection !== null;
  }

  /**
   * Offset of the IO on
   * the uni.
   */
  offset: IPosition = { x: 0, y: 0 };

  /**
   * position
   */
  @observable
  _position: IPosition = {
    x: 0,
    y: 0
  };

  /**
   * update inputs position.
   */
  @action
  update = (position: IPosition) => {
    this._position = Private.readjustPosition(
      this.store.unit.position,
      this.offset
    );
  };

  get position() {
    return this._position;
  }

  // OUTPUT NODE MOUSE EVENTS
  outputonclick = (e: React.MouseEvent<any, MouseEvent>) => {
    if (Private.currentInput && !this.store.unit.owns(Private.currentInput)) {
      let tmp = Private.currentInput;
      Private.currentInput = null;
      this.connect(tmp);
    }
  };

  // INPUT NODE MOUSE EVENTS
  inputonclick = (e: React.MouseEvent<any, MouseEvent>) => {
    if (Private.currentInput) {
      if (Private.currentInput.path!.hasAttribute("d")) {
        Private.currentInput.path!.removeAttribute("d");
      }

      if (Private.currentInput && Private.currentInput.connection) {
        Private.currentInput.connection!.disconnect(Private.currentInput);
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
      this.connection.path!.setAttributeNS(null, "d", s);
    }
  );

  /**
   * Connect another node's input into 'this'
   * output.
   */
  @action
  connect = (input: UnitInput) => {
    (this.node as Tone.AudioNode).connect(input.node);

    // keep a referance to the connected input.
    this.connection = input;
    input.connection = this;
  };

  /**
   * Disconnect 'this' output from
   * another node's input.
   */
  @action
  disconnect = (input: UnitInput) => {
    console.log(input);
    (this.node as Tone.AudioNode).disconnect(input.node);

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
  constructor(
    store: IEffectUnitStore,
    node: Tone.AudioNode | Tone.Master,
    { offset = { x: 0, y: 0 } }: { offset: IPosition }
  ) {
    if (!store.unit) {
      throw Error("Parent store does not have a unit assigned to it");
    }

    this.node = node;
    this.store = store;
    this.offset = offset;

    this.update(this.position);

    this.path = this._createElement();
    store.store._svg!.appendChild(this.path);
  }

  private _createElement(): SVGPathElement {
    let path = document.createElementNS("http://www.w3.org/2000/svg", "path");

    path.setAttributeNS(null, "stroke", "#FFFFFF");
    path.setAttributeNS(null, "stroke-width", "2");
    path.setAttributeNS(null, "fill", "none");

    return path;
  }

  private _isMaster(node: Tone.AudioNode | Tone.Master): node is Tone.Master {
    return (<Tone.AudioNode>node).disconnect !== undefined;
  }
}
