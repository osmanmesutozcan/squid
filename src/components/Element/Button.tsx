import * as React from "react";

import { classname } from "../../util/attributes";
import "./Button.css";

interface IButtonProps {
  className: string;
  shape: "round" | "square";
  type: "active" | "inactive";

  onClick: React.MouseEventHandler;
}

/**
 * Button UI Element.
 *
 * Props:
 * type -- buttons have 2 types. 'active | inactive'
 */
export class Button extends React.Component<IButtonProps> {
  onClick(e: React.MouseEvent) {
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
