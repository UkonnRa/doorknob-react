import React from "react";
import ReactDOM from "react-dom";
import App from "./App";
import * as serviceWorker from "./serviceWorker";
import { BrowserRouter } from "react-router-dom";
import { CssBaseline } from "@material-ui/core";
import { Compose } from "./utils";
import {
  KratosProvider,
  AuthProvider,
  SessionProvider,
  LoggerProvider,
} from "./services";

ReactDOM.render(
  <React.StrictMode>
    <Compose
      components={[
        LoggerProvider,
        BrowserRouter,
        KratosProvider,
        AuthProvider,
        SessionProvider,
      ]}
    >
      <CssBaseline />
      <App />
    </Compose>
  </React.StrictMode>,
  document.getElementById("root")
);

serviceWorker.unregister();
