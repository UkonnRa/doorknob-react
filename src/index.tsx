import React from "react";
import ReactDOM from "react-dom";
import App from "./App";
import * as serviceWorker from "./serviceWorker";
import { BrowserRouter } from "react-router-dom";
import { CssBaseline } from "@material-ui/core";
import { Compose } from "./utils";
import { KratosProvider } from "./services";

ReactDOM.render(
  <React.StrictMode>
    <Compose components={[BrowserRouter, KratosProvider]}>
      <CssBaseline />
      <App />
    </Compose>
  </React.StrictMode>,
  document.getElementById("root")
);

serviceWorker.unregister();
