import * as React from "react";
import Squid from "./pages/Squid";
import { createGlobalStyle, ThemeProvider } from "styled-components";

const color = {
  grey: "#474143",
  yellow: "#ffc636",
  blue: "#00ada9",
  white: "#ffffff",
  red: "#ff6444",
  darkGrey: "#383436",
  darkBlue: "#1D2330",
  darkerBlue: "#13161F"
};

export const theme = {
  color
};

export const GlobalStyles = createGlobalStyle`
  :root {
    --squid-color-1: ${color.darkerBlue};
    --squid-color-2: ${color.yellow};
    --squid-color-3: ${color.blue};
    --squid-color-4: ${color.white};
    --squid-color-5: ${color.red};
    --squid-color-6: ${color.darkBlue};
  }

  html {
    height: 100%;
    width: 100%;
  }

  body {
    margin: 0;
    padding: 0;
    overflow: hidden;
    font-family: "Roboto", sans-serif;
    background-color: var(--squid-color-6);
  }

  /* scrollback styling */
  ::-webkit-scrollbar {
    width: 5px;
    height: 5px;
  }

  ::-webkit-scrollbar-corner {
    background: var(--squid-color-1);
  }

  ::-webkit-scrollbar-thumb {
    background: var(--squid-color-2);
  }
`;

class App extends React.Component {
  render() {
    return (
      <ThemeProvider theme={theme}>
        <React.Fragment>
          <GlobalStyles />
          <Squid />
        </React.Fragment>
      </ThemeProvider>
    );
  }
}

export default App;
