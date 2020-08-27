import React, { FunctionComponent } from "react";
import { BrowserRouter, Switch, Route, Link } from "react-router-dom";
import { Registration } from "./components/Registration";
import { Login } from "./components/Login";

const App: FunctionComponent = () => {
  return (
    <BrowserRouter>
      <nav>
        <ul>
          <li>
            <Link to="/registration">registration</Link>
          </li>
          <li>
            <Link to="/login">login</Link>
          </li>
        </ul>
      </nav>
      <Switch>
        <Route exact path="/registration" component={Registration} />
        <Route exact path="/login" component={Login} />
      </Switch>
    </BrowserRouter>
  );
};

export default App;
