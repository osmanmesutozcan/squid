import * as React from "react";

import Squid, { SquidStore } from "./pages/Squid";

const store = new SquidStore();

class App extends React.Component {
  render() {
    return <Squid store={store} />;
  }
}

export default App;
