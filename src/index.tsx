import React from "react";
import ReactDOM from "react-dom";
import App from "./App";
import * as serviceWorker from "./serviceWorker";
import { BrowserRouter } from "react-router-dom";
import { CssBaseline } from "@material-ui/core";
import { composeProviders } from "./utils";

const GlobalProviders = composeProviders([
  (props) => <BrowserRouter>{props.children}</BrowserRouter>,
]);

ReactDOM.render(
  <React.StrictMode>
    <GlobalProviders>
      <CssBaseline />
      <App />
    </GlobalProviders>
  </React.StrictMode>,
  document.getElementById("root")
);

serviceWorker.unregister();
