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
  Recovery,
  Error,
  Verification,
} from "./pages";
import { withOidcSecure } from "@axa-fr/react-oidc-context";
import { Scaffold } from "./components";

const App: FunctionComponent = () => {
  return (
    <Scaffold>
      <BrowserRouter>
        <Switch>
          <Route path="/hydra/callback" component={HydraCallback} />
          <Route path="/hydra/post-callback" component={HydraPostCallback} />
          <Route path="/callback" component={withOidcSecure(Callback)} />
          <Route path="/registration" component={Registration} />
          <Route path="/recovery" component={Recovery} />
          <Route path="/settings" component={Settings} />
          <Route path="/login" component={Login} />
          <Route path="/consent" component={Consent} />
          <Route path="/error" component={Error} />
          <Route path="/verification" component={Verification} />
          <Route exact path="/" component={withOidcSecure(Dashboard)} />
        </Switch>
      </BrowserRouter>
    </Scaffold>
  );
};

export default App;
