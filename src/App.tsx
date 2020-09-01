import React, { FunctionComponent } from "react";
import { BrowserRouter, Switch, Route, Link } from "react-router-dom";
import {
  Registration,
  Login,
  Callback,
  Dashboard,
  HydraCallback,
  HydraLogin,
} from "./pages";
import { useAuth, useHydra } from "./services";
import { useAuth as useOidc } from "oidc-react";
import { AuthProvider as OidcProvider } from "oidc-react/build/src/AuthContext";
import { Compose } from "./utils";
import { AuthProviderProps } from "oidc-react/build/src/AuthContextInterface";

const oidcConfig: AuthProviderProps = {
  onSignIn: (user) => {
    console.log("Oidc User: ", user);
  },
  authority: "http://127.0.0.1:4444",
  clientId: "absolem-ui",
  redirectUri: "http://localhost:3000/hydra/callback",
};

const App: FunctionComponent = () => {
  const auth = useAuth();
  const hydra = useHydra();

  return (
    <BrowserRouter>
      <nav>
        <ul>
          <li>
            <Link to="/auth/registration">registration</Link>
          </li>
          <li>
            <button onClick={hydra.tryCreateClient}>Create Client</button>
          </li>
          {auth.getAuthed() && (
            <li>
              <button onClick={() => auth.logout()}>Logout</button>
            </li>
          )}
        </ul>
      </nav>
      <Switch>
        <Route path="/temp" component={() => <div>Temp</div>} />
        <Route path="/auth/hydra/login" component={HydraLogin} />
        <Route path="/hydra/callback" component={HydraCallback} />
        <Route path="/callback" component={Callback} />
        <Route path="/auth/registration" component={Registration} />
        <Route path="/auth/login" component={Login} />
        <OidcProvider {...oidcConfig}>
          <Route exact path="/" component={Dashboard} />
        </OidcProvider>
      </Switch>
    </BrowserRouter>
  );
};

export default App;
