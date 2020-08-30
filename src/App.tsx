import React, { FunctionComponent } from "react";
import { BrowserRouter, Switch, Route, Link } from "react-router-dom";
import { Registration, Login } from "./pages";

const App: FunctionComponent = () => {
  return (
    <BrowserRouter>
      <nav>
        <ul>
          <li>
            <Link to="/auth/registration">registration</Link>
          </li>
          <li>
            <Link to="/auth/login">login</Link>
          </li>
        </ul>
      </nav>
      <Switch>
        <Route exact path="/auth/registration" component={Registration} />
        <Route exact path="/auth/login" component={Login} />
      </Switch>
    </BrowserRouter>
  );
};

export default App;
