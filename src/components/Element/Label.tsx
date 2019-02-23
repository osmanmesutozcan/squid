import * as React from "react";
import styled from "styled-components";

const StyledP = styled.p`
  font-size: ${({ theme }) => theme.font.label};
`;

interface ILabelProps {
  title: string;
  className?: string;
}

export class Label extends React.PureComponent<ILabelProps> {
  render() {
    return (
      <StyledP className={this.props.className}>{this.props.title}</StyledP>
    );
  }
}
