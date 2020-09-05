import React, { FunctionComponent } from "react";
import { BrowserRouter, Switch, Route } from "react-router-dom";
import {
  Registration,
  Login,
  Callback,
  Dashboard,
  HydraCallback,
  HydraPostCallback,
  Consent,
  Settings,
} from "./pages";
import { withOidcSecure } from "@axa-fr/react-oidc-context";

const App: FunctionComponent = () => {
  return (
    <BrowserRouter>
      <Switch>
        <Route path="/hydra/callback" component={HydraCallback} />
        <Route path="/hydra/post-callback" component={HydraPostCallback} />
        <Route path="/callback" component={withOidcSecure(Callback)} />
        <Route path="/registration" component={Registration} />
        <Route path="/settings" component={Settings} />
        <Route path="/login" component={Login} />
        <Route path="/consent" component={Consent} />
        <Route exact path="/" component={withOidcSecure(Dashboard)} />
      </Switch>
    </BrowserRouter>
  );
};

export default App;
