import * as Tone from "tone";
import {
  EffectUnitModel,
  UnitInput,
  EffectUnitStore,
  IEffectUnitStore
} from "../../EffectUnit";
import { DockStore } from "../../Dock";

const CLIENT_ID = "client_id=YeB1O6rbKc9vlNIbA4ghoAxzOoGLK6fZ";
const STREAM_SRC = (source: string) => `${source}?${CLIENT_ID}`;
const SOUNDCLOUD_RESOLVE = (perma: string) =>
  `https://api.soundcloud.com/resolve.json?url=${perma}&${CLIENT_ID}`;

/**
 * Oscillator unit main model.
 */
export class PlayerModel extends EffectUnitStore implements IEffectUnitStore {
  /**
   * Effect unit core.
   */
  unit: EffectUnitModel;

  /**
   * Audio source node.
   */
  private _source: any | null = null;
  get source() {
    return this._source;
  }

  player: HTMLAudioElement | null = null;

  async search(keyword: string) {
    const res = await fetch(SOUNDCLOUD_RESOLVE(keyword));
    const data = await res.json();

    if (!data.stream_url || !data.streamable) {
      return;
    }

    this.player!.src = STREAM_SRC(data.stream_url);
  }

  constructor(store: DockStore) {
    super(store, 0, 1);
    this.unit = new EffectUnitModel(this);
  }

  init = (player: HTMLAudioElement) => {
    this.player = player;

    this._source = (Tone as any).context.createMediaElementSource(this.player);

    this.outputs[0] = new UnitInput(this, this._source, {
      offset: {
        x: 200,
        y: 27.5
      }
    });
  };

  dispose = () => {
    this._source.dispose();
  };
}
