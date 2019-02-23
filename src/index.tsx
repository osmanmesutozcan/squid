import * as React from "react";
import * as ReactDOM from "react-dom";

import App from "./App";
import * as serviceWorker from "./serviceWorker";

ReactDOM.render(<App />, document.getElementById("root"));

if ((module as any).hot) {
  (module as any).hot.accept("./App", () => {
    const NextApp = require("./App").default;
    ReactDOM.render(<NextApp />, document.getElementById("root"));
  });
}

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: http://bit.ly/CRA-PWA
serviceWorker.unregister();
