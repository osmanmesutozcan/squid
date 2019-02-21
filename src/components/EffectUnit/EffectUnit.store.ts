import * as uuid from "uuid";
import { observable, computed, action } from "mobx";

import { DockStore } from "../Dock";
import { IPosition } from "../../lib/position";
import { UnitInput } from "./UnitInput.store";

export interface IEffectUnitStore {
  /**
   * Unique id of the unit
   */
  uuid: string;

  /**
   * Parent data store.
   */
  store: DockStore;

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

  store: DockStore;

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
    this.inputs.concat(this.outputs).forEach(update);
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
    this.inputs.concat(this.outputs).forEach(update);
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

  /**
   * @argument dock {DockStore} Referance to dock store.
   * @argument unit {UnitStore} Referance to wrapper unit store..
   */
  constructor(dock: DockStore) {
    this.store = dock;
  }
}
