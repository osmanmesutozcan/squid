import * as uuid from "uuid";
import { observable, computed, action } from "mobx";

import { Root } from "../../stores/root.store";
import { IPosition } from "../../lib/position";
import { UnitInput } from "./UnitInput.store";

export interface IEffectUnitStore {
  /**
   * Unique id of the unit
   */
  uuid: string;

  /**
   * Referance to the root store.
   */
  root: typeof Root;

  /**
   * Number of outputs of the defined effect unit
   */
  outputs: UnitInput[];

  /**
   * Number of inputs of the defined effect unit
   */
  inputs: UnitInput[];

  /**
   * Clean up after unit is removed from dom.
   */
  dispose: () => void;
}

/**
 * EffectUnit base store for commons.
 */
export class EffectUnitStore {
  uuid = uuid();

  @observable
  inputs: UnitInput[] = [];

  @observable
  outputs: UnitInput[] = [];

  /**
   * Current position of this unit.
   */
  @observable
  _position: IPosition = {
    x: 800,
    y: 800
  };

  @action
  updatePositions = (position: IPosition) => {
    this._position = position;

    const update = (io: UnitInput) => io.updatePosition();
    this.inputs.forEach(update);
    this.outputs.forEach(update);
  };

  get position() {
    return this._position;
  }
  set position(position) {
    this.updatePositions(position);
  }

  // Trigger each node to calculate its own offset relative to its parents.
  updateOffsets = () => {
    const update = (io: UnitInput) => io.updateOffset();
    this.inputs.forEach(update);
    this.outputs.forEach(update);
  };

  // HELPERS
  /**
   * Checks if outputs is owned by its parent store.
   */
  owns = (io: UnitInput) => {
    return this.outputs.some(o => o.id === io.id);
  };

  /**
   * checks if output with given index is connected
   * or not.
   */
  oconnected = (idx: number) => {
    return computed(
      () => this.outputs[idx] !== undefined && this.outputs[idx].isConnected
    );
  };

  /**
   * checks if input with given index is connected
   * or not.
   */
  iconnected = (idx: number) => {
    return computed(
      () => this.inputs[idx] !== undefined && this.inputs[idx].isConnected
    );
  };

  constructor(public root: typeof Root) {}
}
