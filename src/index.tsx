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
import i18n from "./i18n";
import { I18nextProvider } from "react-i18next";

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
      <CssBaseline />
      <App />
    </I18nextProvider>
  </Compose>,
  document.getElementById("root")
);

serviceWorker.unregister();
