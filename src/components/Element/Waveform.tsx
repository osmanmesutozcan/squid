import * as React from "react";

import { classname } from "../../util/attributes";

interface IWaveFormProps {
  analyser: any;
  className?: string;
}

/**
 * General waveform component.
 */
export class WaveForm extends React.Component<IWaveFormProps> {
  private _frameId: number | null = null;

  constructor(props: IWaveFormProps) {
    super(props);

    this._stop = this._stop.bind(this);
    this._loop = this._loop.bind(this);
    this._start = this._start.bind(this);
    this._update = this._update.bind(this);
  }

  componentDidMount() {
    this._start();
  }

  componentWillUnmount() {
    this._stop();
  }

  /**
   * start animation.
   */
  _start() {
    if (!this._frameId) {
      this._frameId = window.requestAnimationFrame(this._loop);
    }
  }

  /**
   * stop animation.
   */
  _stop() {
    window.cancelAnimationFrame(this._frameId!);
  }

  /**
   * main animation loop.
   */
  _loop() {
    this._update();
    this._frameId = window.requestAnimationFrame(this._loop);
  }

  /**
   * update canvas.
   */
  _update() {
    const ctx = (this.refs.canvas as HTMLCanvasElement).getContext("2d")!;
    const values = this.props.analyser.getValue();

    let canvasHeight = ctx.canvas.height;
    let canvasWidth = ctx.canvas.width;

    ctx.clearRect(0, 0, canvasWidth, canvasHeight);
    ctx.beginPath();
    ctx.lineJoin = "round";
    ctx.lineWidth = 3;
    ctx.strokeStyle = "white";
    ctx.moveTo(0, ((values[0] + 1) / 2) * canvasHeight);
    for (var i = 1, len = values.length; i < len; i++) {
      var val = (values[i] + 1) / 2;
      var x = canvasWidth * (i / (len - 1));
      var y = val * canvasHeight;
      ctx.lineTo(x, y);
    }

    ctx.stroke();
  }

  render() {
    const className = classname([this.props.className!]);

    return <canvas ref="canvas" className={className} />;
  }
}
