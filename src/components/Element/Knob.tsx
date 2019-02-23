import * as React from "react";
import styled from "styled-components";
import { observable, action } from "mobx";
import { observer } from "mobx-react";
import { Label } from "./Label";

interface IKnobProps {
  min: number;
  max: number;
  step?: number;
  label: string;
  color: string;
  radius: number;
  value?: number;
  className?: string;
  onChange?: (value: number) => void;
}

// TODO: Remove calculations from here.
@observer
class KnobBase extends React.Component<IKnobProps> {
  private _dial: HTMLDivElement | null = null;

  @observable private _dialing = false;
  @observable private _rotation = -132;
  @observable private _value = 0;

  componentDidMount() {
    window.addEventListener("mousemove", this._handleMouseMove);
    this._dial!.addEventListener("mousedown", this._handleMouseDown);
    window.addEventListener("mouseup", action(() => (this._dialing = false)));

    if (this.props.value) {
      this._value = this.props.value;
    }
  }

  componentWillUnmount() {
    window.removeEventListener("mousemove", this._handleMouseMove);
    this._dial!.removeEventListener("mousedown", this._handleMouseDown);
    window.removeEventListener(
      "mouseup",
      action(() => (this._dialing = false))
    );
  }

  render() {
    return (
      <div ref={n => (this._dial = n)} className={this.props.className}>
        {/** Label */}
        <div
          className="dial-value"
          style={{ color: this._dialing ? this.props.color : "transparent" }}
        >
          {this._value}
        </div>

        {/* Grip */}
        <div
          className="dial-grip"
          style={{ transform: `rotate(${this._rotation}deg)` }}
        />

        {/* Label Stuff */}
        <Label className="knob-label" title={this.props.label} />

        {/* SVG path */}
        <svg className="dial-svg" viewBox="0 0 100 100">
          <path d="M20,76 A 40 40 0 1 1 80 76" fill="none" stroke="#55595C" />
          <path
            d="M20,76 A 40 40 0 1 1 80 76"
            fill="none"
            stroke={this.props.color}
            style={{
              strokeDashoffset: 184 - 184 * ((this._rotation * 1 + 132) / 264)
            }}
          />
        </svg>
      </div>
    );
  }

  private _currentYCache = 0;

  @action private _handleMouseDown = (e: MouseEvent) => {
    this._currentYCache = e.pageY;
    this._dialing = true;
  };

  @action private _handleMouseMove = (e: MouseEvent) => {
    if (!this._dialing) {
      return;
    }

    e.preventDefault();

    this._setRotation(e, this.props.step);

    this._setValue();
  };

  @action private _setRotation = (e: MouseEvent, step: number = 1) => {
    const { min, max } = this.props;

    const deltaY = e.pageY - this._currentYCache;
    const stepPercentage = (step * 100) / (max - min);
    const stepRad = (264 / 100) * stepPercentage;
    const stepFn = deltaY < 0 ? Math.round : Math.ceil;
    const deltaRotation = stepFn(deltaY / stepRad) * stepRad;
    const rotation = this._rotation - deltaRotation;

    if (deltaRotation === 0) {
      this._currentYCache = e.pageY - deltaY;
    }
    if (deltaRotation !== 0) {
      this._rotation = rotation;
      this._currentYCache = e.pageY;
    }
    if (rotation >= 132) {
      this._rotation = 132;
    }
    if (rotation <= -132) {
      this._rotation = -132;
    }
  };

  @action private _setValue = () => {
    const percentage = ((this._rotation + 132) / 264) * 100;
    const window = this.props.max - this.props.min;
    const comp = this.props.min + (window / 100) * percentage;
    const res = parseFloat(comp.toFixed(2));

    if (!isFinite(res)) {
      return;
    }

    this._value = res;

    if (this.props.onChange) {
      this.props.onChange(res);
    }
  };
}

// --- Styled
export const Knob = styled(KnobBase)`
  height: ${({ radius = 18 }) => radius * 2}px;
  width: ${({ radius }) => radius * 2}px;

  display: flex;
  justify-content: space-around;
  align-items: center;
  position: relative;
  margin: 0;

  .knob-label {
    position: absolute;
    bottom: -5px;
    margin: 0;
    color: ${({ theme }) => theme.color.white};
    user-select: none;
  }

  .dial-value {
    font-size: ${({ theme }) => theme.font.label};
    position: absolute;
    transition: color 0.3s cubic-bezier(0, 0, 0.24, 1);
  }

  .dial-grip {
    height: ${({ radius = 18 }) => radius * 2 - radius / 3}px;
    width: ${({ radius = 18 }) => radius * 2 - radius / 3}px;

    z-index: 2;
    border-radius: 50%;
  }

  .dial-grip:after {
    background-color: ${({ color }) => color};
    left: ${({ radius = 18 }) => radius - radius / 6 - 1}px;

    content: "";
    height: ${({ radius = 18 }) => radius / 3}px;
    width: 2px;
    position: absolute;
    top: 0;
  }

  .dial-svg {
    height: ${({ radius }) => radius * 2}px;
    width: ${({ radius }) => radius * 2}px;

    pointer-events: none;
    position: absolute;
    top: 0;
    left: 0;
    stroke-width: 3;
    stroke-dasharray: 184 184;

    path {
      transition: 0.15s cubic-bezier(0, 0, 0.24, 1);
    }
  }
`;
