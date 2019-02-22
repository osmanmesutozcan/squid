import * as React from "react";
import styled, { css } from "styled-components";

interface IButtonProps {
  height?: number;
  width?: number;
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
      </button>
    );
  }
}

// --- Styled

const baseStyles = css`
  border-radius: 5px;
  text-align: center;
  text-decoration: none;
  padding: 5px 10px;
  background: transparent;

  :focus {
    outline: 0;
  }
`;

export const Button = styled(ButtonBase)`
  ${baseStyles}

  ${(p: IButtonProps) => (p.shape === "round" ? "border-radius: 50%;" : "")}
  height: ${p => `${(p.height || 35) * 2}`}px;
  width: ${p => `${(p.width || 35) * 2}`}px;

  border: solid 2px ${({ type, theme }) =>
    type === "active" ? theme.color.red : theme.color.white};
  color: ${p => ({ type, theme }) =>
    type === "active" ? theme.color.red : theme.color.white};

  :active {
    /* add background with opacity reduced */
    background: ${p =>
      p.type === "active"
        ? `${p.theme.color.red}44`
        : `${p.theme.color.white}44`};
  }
`;
