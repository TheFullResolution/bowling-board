import React from "react";
import ReactDOM from "react-dom";
import "typeface-roboto";
import { App } from "./App/App";

const rootEl = document.getElementById("root");

ReactDOM.render(<App />, rootEl);

if ((module as any).hot) {
  (module as any).hot.accept("./App/App", () => {
    const NextApp = require("./App/App").default;
    ReactDOM.render(<NextApp />, rootEl);
  });
}
