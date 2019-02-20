import * as React from "react";

import { classname } from "../../util/attributes";
import "./Slider.css";

interface ISliderProps {
  className?: string;

  onChange: Function;

  min: number;
  max: number;
  step: number;
  value: number;
}

/**
 * Slider UI Element.
 */
export class Slider extends React.Component<ISliderProps> {
  render() {
    let className = classname(["squid-slider", this.props.className!]);

    let inputProps = {
      min: this.props.min,
      max: this.props.max,
      step: this.props.step,
      value: this.props.value
    };

    return (
      <input
        {...inputProps}
        type="range"
        className={className}
        onChange={e => this.props.onChange(e, e.target.value)}
      />
    );
  }
}
