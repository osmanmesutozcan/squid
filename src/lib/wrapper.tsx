// wrapper for providing stuff in docz environment

import * as React from "react";
import { Provider } from "mobx-react";
import { Root } from "../stores/root.store";
import { ThemeProvider } from "styled-components";
import { theme } from "../App";

export default class Wrapper extends React.Component {
  render() {
    return (
      <Provider store={Root}>
        <ThemeProvider theme={theme}>
          <React.Fragment>{this.props.children}</React.Fragment>
        </ThemeProvider>
      </Provider>
    );
  }
}
