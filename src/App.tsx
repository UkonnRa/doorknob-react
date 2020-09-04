import React, { FunctionComponent } from "react";
import { BrowserRouter, Switch, Route, Link } from "react-router-dom";
import {
  Registration,
  Login,
  Callback,
  Dashboard,
  HydraCallback,
  HydraPostCallback,
  Consent,
} from "./pages";
import { withOidcSecure } from "@axa-fr/react-oidc-context";

const App: FunctionComponent = () => {
  return (
    <BrowserRouter>
      <nav>
        <ul>
          <li>
            <Link to="/auth/registration">registration</Link>
          </li>
        </ul>
      </nav>
      <Switch>
        <Route path="/hydra/callback" component={HydraCallback} />
        <Route path="/hydra/post-callback" component={HydraPostCallback} />
        <Route path="/callback" component={withOidcSecure(Callback)} />
        <Route path="/auth/registration" component={Registration} />
        <Route path="/auth/login" component={Login} />
        <Route path="/auth/consent" component={Consent} />
        <Route exact path="/" component={withOidcSecure(Dashboard)} />
      </Switch>
    </BrowserRouter>
  );
};

export default App;
