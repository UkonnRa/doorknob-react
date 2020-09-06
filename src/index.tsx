import React from "react";
import ReactDOM from "react-dom";
import App from "./App";
import * as serviceWorker from "./serviceWorker";
import { BrowserRouter } from "react-router-dom";
import { createMuiTheme, CssBaseline } from "@material-ui/core";
import { Compose } from "./utils";
import { KratosProvider, LoggerProvider, SnackProvider } from "./services";
import { AuthenticationProvider } from "@axa-fr/react-oidc-context";
import i18n from "./i18n";
import { I18nextProvider } from "react-i18next";
import { ThemeProvider } from "@material-ui/core/styles";

const oidcConfig = {
  client_id: "absolem-ui",
  redirect_uri: "http://127.0.0.1:4455/callback",
  response_type: "code",
  scope: "openid offline profile:read email",
  authority: "http://127.0.0.1:4455/.ory/hydra/public",
  silent_redirect_uri: "http://127.0.0.1:4455/callback",
};

const theme = createMuiTheme({
  palette: {
    type: "dark",
  },
});

ReactDOM.render(
  <Compose
    components={[SnackProvider, LoggerProvider, BrowserRouter, KratosProvider]}
  >
    <I18nextProvider i18n={i18n}>
      <AuthenticationProvider configuration={oidcConfig}>
        <ThemeProvider theme={theme}>
          <CssBaseline />
          <App />
        </ThemeProvider>
      </AuthenticationProvider>
    </I18nextProvider>
  </Compose>,
  document.getElementById("root")
);

serviceWorker.unregister();
