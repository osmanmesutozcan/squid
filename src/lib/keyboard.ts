export interface IMIDIKeyEvent {
  type: "down" | "up";
  note: string;
}

export interface IControlKeyEvent {
  type: "down" | "up";
  key: "Space" | "ArrowRight" | "ArrowLeft" | "ArrowUp" | "ArrowDown";
}
