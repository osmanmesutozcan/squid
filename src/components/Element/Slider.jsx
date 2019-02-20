import React from "react";

import { classname } from "../../util/attributes";
import "./Slider.css";

/**
 * Slider UI Element.
 */
export default class Slider extends React.Component {
  onClick(e) {
    const { onClick } = this.props;

    if (onClick) {
      onClick(e);
    }
  }

  render() {
    let className = classname(["squid-slider", this.props.className]);

    return (
      <input
        type="range"
        className={className}
        {...this.props}
        onChange={e => this.props.onChange(e, e.target.value)}
      />
    );
  }
}
