import * as React from "react";
import styled, { css } from "styled-components";
import { Label } from "./Label";

interface IButtonProps {
  label?: string;
  width?: number;
  height?: number;
  className?: string;
  shape: "round" | "square";
  type: "active" | "inactive";
  onClick: React.MouseEventHandler;
}

class ButtonBase extends React.Component<IButtonProps> {
  onClick(e: React.MouseEvent) {
    const { onClick } = this.props;

    if (onClick) {
      onClick(e);
    }
  }

  render() {
    return (
      <button
        className={this.props.className}
        onClick={this.onClick.bind(this)}
      >
        {this.props.children}
        {this.props.label && (
          <Label className="button-label" title={this.props.label} />
        )}
      </button>
    );
  }
}

// --- Styled

export const Button = styled(ButtonBase)`
  border-radius: 5px;
  text-align: center;
  text-decoration: none;
  padding: 5px 10px;
  background: transparent;

  ${(p: IButtonProps) => (p.shape === "round" ? "border-radius: 50%;" : "")}
  height: ${p => `${(p.height || 35) * 2}`}px;
  width: ${p => `${(p.width || 35) * 2}`}px;

  border: solid 2px ${({ type, theme }) =>
    type === "active" ? theme.color.red : theme.color.white};
  color: ${p => ({ type, theme }) =>
    type === "active" ? theme.color.red : theme.color.white};

  :focus {
    outline: 0;
  }

  :active {
    /* add background with opacity reduced */
    background: ${p =>
      p.type === "active"
        ? `${p.theme.color.red}44`
        : `${p.theme.color.white}44`};
  }

  .button-label {
    position: absolute;
    bottom: -2px;
  }
`;
