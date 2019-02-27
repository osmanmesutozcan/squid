import * as Tone from "tone";

export const snareDrum = () =>
  new Tone.NoiseSynth({
    noise: {
      type: "pink",
      playbackRate: 3
    },
    envelope: {
      attack: 0.001,
      decay: 0.13,
      sustain: 0,
      release: 0.03
    }
  });
