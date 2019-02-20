import React from "react";
import PropTypes from "prop-types";

import { classname } from "../../util/attributes";
import "./Button.css";

/**
 * Button UI Element.
 *
 * Props:
 * type -- buttons have 2 types. 'active | inactive'
 */
export default class Button extends React.Component {
  onClick(e) {
    const { onClick } = this.props;

    if (onClick) {
      onClick(e);
    }
  }

  render() {
    let className = classname([
      "squid-button",
      this.props.type,
      this.props.shape,
      this.props.className
    ]);

    return (
      <button
        ref="button"
        onClick={this.onClick.bind(this)}
        className={className}
      >
        {this.props.children}
      </button>
    );
  }
}

Button.propTypes = {
  shape: PropTypes.oneOf(["round", "square"]),
  type: PropTypes.oneOf(["active", "inactive"])
};
