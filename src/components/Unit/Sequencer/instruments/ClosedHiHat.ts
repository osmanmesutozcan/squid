import * as Tone from "tone";

export const closedHiHat = () =>
  new Tone.NoiseSynth({
    noise: { type: "white" },
    volume: -10,
    filter: {
      Q: 1
    },
    envelope: {
      attack: 0.01,
      decay: 0.15
    },
    filterEnvelope: {
      attack: 0.01,
      decay: 0.03,
      baseFrequency: 4000,
      octaves: -2.5,
      exponent: 4
    }
  });
