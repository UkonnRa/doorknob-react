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
import { useAuth } from "./services";
import { AuthProvider as OidcProvider } from "oidc-react/build/src/AuthContext";
import { AuthProviderProps } from "oidc-react/build/src/AuthContextInterface";

const oidcConfig: AuthProviderProps = {
  onSignIn: (user) => {
    console.log("Oidc User: ", user);
  },
  authority: "http://127.0.0.1:4455/.ory/hydra/public",
  clientId: "absolem-ui",
  redirectUri: "http://127.0.0.1:4455",
  scope: "openid profile:read",
};

const App: FunctionComponent = () => {
  const auth = useAuth();

  return (
    <BrowserRouter>
      <nav>
        <ul>
          <li>
            <Link to="/auth/registration">registration</Link>
          </li>
          {auth.getAuthed() && (
            <li>
              <button onClick={() => auth.logout()}>Logout</button>
            </li>
          )}
        </ul>
      </nav>
      <Switch>
        <Route path="/hydra/callback" component={HydraCallback} />
        <Route path="/hydra/post-callback" component={HydraPostCallback} />
        <Route path="/callback" component={Callback} />
        <Route path="/auth/registration" component={Registration} />
        <Route path="/auth/login" component={Login} />
        <Route path="/auth/consent" component={Consent} />
        <Route
          exact
          path="/"
          component={() => (
            <OidcProvider {...oidcConfig}>
              <Dashboard />
            </OidcProvider>
          )}
        />
      </Switch>
    </BrowserRouter>
  );
};

export default App;
