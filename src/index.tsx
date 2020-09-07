import React from "react";
import ReactDOM from "react-dom";
import App from "./App";
import * as serviceWorker from "./serviceWorker";
import { BrowserRouter } from "react-router-dom";
import { CssBaseline } from "@material-ui/core";
import { Compose } from "./utils";
import {
  KratosProvider,
  LoggerProvider,
  SnackProvider,
  ThemeChangerProvider,
} from "./services";
import { AuthenticationProvider } from "@axa-fr/react-oidc-context";
import i18n from "./i18n";
import { I18nextProvider } from "react-i18next";

const oidcConfig = {
  client_id: "absolem-ui",
  redirect_uri: "http://127.0.0.1:4455/callback",
  response_type: "code",
  scope: "openid offline profile:read email",
  authority: "http://127.0.0.1:4455/.ory/hydra/public",
  silent_redirect_uri: "http://127.0.0.1:4455/callback",
};

ReactDOM.render(
  <Compose
    components={[
      ThemeChangerProvider,
      SnackProvider,
      LoggerProvider,
      BrowserRouter,
      KratosProvider,
    ]}
  >
    <I18nextProvider i18n={i18n}>
      <AuthenticationProvider configuration={oidcConfig}>
        <CssBaseline />
        <App />
      </AuthenticationProvider>
    </I18nextProvider>
  </Compose>,
  document.getElementById("root")
);

serviceWorker.unregister();
