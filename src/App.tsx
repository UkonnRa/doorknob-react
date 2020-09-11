import React, {
  FunctionComponent,
  JSXElementConstructor,
  PropsWithChildren,
} from "react";
import { BrowserRouter, Switch, Route } from "react-router-dom";
import {
  Registration,
  Login,
  Dashboard,
  HydraCallback,
  HydraPostCallback,
  Consent,
  Settings,
  Recovery,
  Error,
  Verification,
  PostLogout,
  Callback,
} from "./pages";
import { AppFrame, Scaffold } from "./components";
import { AuthProvider, UserManager } from "oidc-react";
import { AuthProviderProps } from "oidc-react/build/src/AuthContextInterface";

const oidcConfig: AuthProviderProps = {
  userManager: new UserManager({
    client_id: "absolem-ui",
    redirect_uri: "http://127.0.0.1:4455/callback",
    post_logout_redirect_uri: "http://127.0.0.1:4455/post-logout",
    response_type: "code",
    scope: "openid offline profile:read email",
    authority: "http://127.0.0.1:4455/.ory/hydra/public",
    loadUserInfo: true,
  }),
};

const App: FunctionComponent = () => {
  const withScaffold = (
    Child: JSXElementConstructor<PropsWithChildren<unknown>>
  ) => {
    return function ScaffoldWrapper() {
      return (
        <Scaffold>
          <Child />
        </Scaffold>
      );
    };
  };

  const withAppFrame = (
    Child: JSXElementConstructor<PropsWithChildren<unknown>>
  ) => {
    return function AppWrapper() {
      return (
        <AuthProvider {...oidcConfig}>
          <AppFrame>
            <Child />
          </AppFrame>
        </AuthProvider>
      );
    };
  };

  return (
    <BrowserRouter>
      <Switch>
        <Route path="/hydra/callback" component={withScaffold(HydraCallback)} />
        <Route
          path="/hydra/post-callback"
          component={withScaffold(HydraPostCallback)}
        />
        <Route path="/callback" component={withScaffold(Callback)} />
        <Route path="/registration" component={withScaffold(Registration)} />
        <Route path="/recovery" component={withScaffold(Recovery)} />
        <Route path="/settings" component={withAppFrame(Settings)} />
        <Route path="/login" component={withScaffold(Login)} />
        <Route path="/consent" component={withScaffold(Consent)} />
        <Route path="/post-logout" component={withScaffold(PostLogout)} />
        <Route path="/error" component={withScaffold(Error)} />
        <Route path="/verification" component={withScaffold(Verification)} />
        <Route exact path="/" component={withAppFrame(Dashboard)} />
      </Switch>
    </BrowserRouter>
  );
};

export default App;
