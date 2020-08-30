import React from "react";
import ReactDOM from "react-dom";
import App from "./App";
import * as serviceWorker from "./serviceWorker";
import { BrowserRouter } from "react-router-dom";
import { CssBaseline } from "@material-ui/core";
import { composeProviders } from "./utils";
import { KratosProvider } from "./services";

const GlobalProviders = composeProviders([
  (props) => <BrowserRouter>{props.children}</BrowserRouter>,
  (props) => <KratosProvider>{props.children}</KratosProvider>,
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
