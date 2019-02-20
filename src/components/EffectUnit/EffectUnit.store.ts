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
   * Effect unit core.
   */
  unit: EffectUnitModel;

  /**
   * Parent data store.
   */
  store: DockStore;

  /**
   * Number of outputs of the defined effect unit
   */
  output: number;
  outputs: UnitInput[];

  /**
   * Number of inputs of the defined effect unit
   */
  input: number;
  inputs: UnitInput[];

  /**
   * Clean up after unit is removed from dom.
   */
  dispose: () => void;
}

export class EffectUnitStore {
  uuid = uuid();

  inputs: UnitInput[] = [];

  outputs: UnitInput[] = [];

  constructor(
    public store: DockStore,
    public input: number,
    public output: number
  ) {}
}

export class EffectUnitModel {
  /**
   * Unique id for this unit.
   */
  uuid: string;

  /**
   * refers to owner Unit.
   */
  store: IEffectUnitStore;

  /**
   * Current position of this unit.
   */
  @observable
  _position: IPosition = {
    x: 800,
    y: 800
  };

  @action
  updatePosition = (position: IPosition) => {
    this._position = position;
    this.updateInputs(position);
    this.updateOutputs(position);
  };

  /**
   * update input nodes of the parent store.
   */
  updateInputs = (position: IPosition) => {
    this.store.inputs.forEach(i => {
      i.update(position);
    });
  };

  /**
   * update output nodes of the parent store.
   */
  updateOutputs = (position: IPosition) => {
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
  owns = (input: UnitInput) => {
    for (let i = 0; i < this.store.input; i++) {
      if (this.store.outputs[i].id === input.id) {
        return true;
      }
    }

    return false;
  };

  constructor(store: IEffectUnitStore) {
    this.store = store;
    this.uuid = store.uuid;
  }
}
