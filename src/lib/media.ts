export class Recorder {
  private _recorder: MediaRecorder;

  // Record Event datas.
  private _chunks: any[] = [];

  // Resolves with data after stop.
  private _resolver: ((value: Blob) => void) | null = null;

  private _destination: MediaStreamAudioDestinationNode;
  get destination() {
    return this._destination;
  }

  start = () => {
    this._chunks = [];
    this._recorder.start();
  };

  stop = (): Promise<Blob> => {
    return new Promise<Blob>(resolve => {
      this._resolver = resolve;
      this._recorder.stop();
    });
  };

  constructor(context: AudioContext) {
    this._destination = context.createMediaStreamDestination();

    this._recorder = new MediaRecorder(this._destination.stream);
    this._recorder.ondataavailable = e => this._chunks.push(e.data);

    this._recorder.onstop = () => {
      this._resolver!(
        new Blob(this._chunks, { type: "audio/ogg; codecs=opus" })
      );
    };
  }
}
