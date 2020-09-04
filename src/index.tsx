import React from "react";
import ReactDOM from "react-dom";
import App from "./App";
import * as serviceWorker from "./serviceWorker";
import { BrowserRouter } from "react-router-dom";
import { CssBaseline } from "@material-ui/core";
import { Compose } from "./utils";
import { KratosProvider, LoggerProvider } from "./services";
import { AuthenticationProvider } from "@axa-fr/react-oidc-context";

const oidcConfig = {
  client_id: "absolem-ui",
  redirect_uri: "http://127.0.0.1:4455/callback",
  response_type: "code",
  scope: "openid offline profile:read email",
  authority: "http://127.0.0.1:4455/.ory/hydra/public",
  silent_redirect_uri: "http://127.0.0.1:4455/callback",
};

ReactDOM.render(
  <React.StrictMode>
    <Compose components={[LoggerProvider, BrowserRouter, KratosProvider]}>
      <CssBaseline />
      <AuthenticationProvider configuration={oidcConfig}>
        <App />
      </AuthenticationProvider>
    </Compose>
  </React.StrictMode>,
  document.getElementById("root")
);

serviceWorker.unregister();
