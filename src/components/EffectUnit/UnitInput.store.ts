import * as uuid from "uuid";
import * as Tone from "tone";
import { observable, action, reaction } from "mobx";

import { IPosition } from "../../lib/position";
import { EffectUnitStore } from "./EffectUnit.store";
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
  store: EffectUnitStore;

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
  @observable private _isConnected = false;
  get isConnected() {
    return this._isConnected;
  }

  /**
   * Offset of the IO on the unit calculated via dom attributes.
   */
  offset: IPosition = {
    x: 0,
    y: 0
  };

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
  updatePosition = () => {
    this._position = Private.readjustPosition(this.store.position, this.offset);
  };

  get position() {
    return this._position;
  }

  /**
   * update inputs offset
   */
  @action
  updateOffset = () => {
    const node = document.querySelector(
      `[data-uuid="${this.id}"]`
    )! as HTMLDivElement;

    const offsetTop = node.offsetTop + 7;
    const offsetLeft = (node.offsetParent! as HTMLDivElement).offsetLeft + 7;

    // always negative because the center is top left corner
    // of the parent.
    this.offset = { x: offsetLeft, y: offsetTop };
  };

  outputonclick = (e: React.MouseEvent<any, MouseEvent>) => {
    if (Private.currentInput && !this.store.owns(Private.currentInput)) {
      let tmp = Private.currentInput;
      Private.currentInput = null;
      this.connect(tmp);
    }
  };

  // INPUT NODE MOUSE EVENTS chore.
  // to summerize it removes the path svgs between connections
  // and tries to disconnect them from each other
  inputonclick = (e: React.MouseEvent<any, MouseEvent>) => {
    // Temporary connection to mouse disconnects.
    if (Private.currentInput) {
      if (Private.currentInput.path!.hasAttribute("d")) {
        Private.currentInput.path!.removeAttribute("d");
      }

      if (Private.currentInput && Private.currentInput.connection) {
        Private.currentInput.connection!.disconnect(Private.currentInput);
        Private.currentInput.connection = null;
      }
    }

    // connection to other node disconnects..
    Private.currentInput = this;
    if (this.connection) {
      if (this.connection.path!.hasAttribute("d")) {
        this.connection.path!.removeAttribute("d");
      }

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

      let iP = position;
      let oP = this.connection.position;

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

    // --- ui
    this._isConnected = true;
    input._isConnected = true;
  };

  /**
   * Disconnect 'this' output from
   * another node's input.
   */
  @action
  disconnect = (input: UnitInput) => {
    (this.node as Tone.AudioNode).disconnect(input.node);
    // remove all referances
    this.connection = null;
    input.connection = null;

    // --- ui
    this._isConnected = false;
    input._isConnected = false;
  };

  constructor(store: EffectUnitStore, node: Tone.AudioNode | Tone.Master) {
    this.node = node;
    this.store = store;

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
}
