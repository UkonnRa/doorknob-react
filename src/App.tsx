import React, { FunctionComponent } from "react";
import { BrowserRouter, Switch, Route, Link } from "react-router-dom";
import { Registration, Login, Callback, Dashboard } from "./pages";
import { useAuth } from "./services";
import winston from "winston";
import { BrowserConsole } from "./utils";

const App: FunctionComponent = () => {
  const auth = useAuth();
  const logger = winston.createLogger({
    transports: [
      new BrowserConsole({
        silent: true,
        level: "debug",
      }),
    ],
  });

  if (process.env.NODE_ENV !== "production") {
    logger.transports.forEach((transport) => (transport.silent = false));
  }

  logger.debug("DEBUG ", { a: 1, b: "two" });
  logger.debug("DEBUG ", { a: 1, b: "two" });
  logger.info("INFO ", { a: 1, b: "two" });
  logger.info("INFO ", { a: 1, b: "two" });
  logger.warn("WARN", { a: 1, b: "two" });
  logger.warn("WARN", { a: 1, b: "two" });
  logger.error("ERROR ", { a: 1, b: "two" });
  logger.error("ERROR ", { a: 1, b: "two" });

  logger.debug("A message alone :(  \n hahaha");
  logger.debug("Here examinable Object ", {
    test: "test",
    sub: { object: { test: "here" } },
  });
  logger.debug({ test: "test", sub: { object: { test: "here" } } });

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
          {auth.getAuthed() && (
            <li>
              <button onClick={() => auth.logout()}>Logout</button>
            </li>
          )}
        </ul>
      </nav>
      <Switch>
        <Route path="/callback" component={Callback} />
        <Route path="/auth/registration" component={Registration} />
        <Route path="/auth/login" component={Login} />
        <Route exact path="/" component={Dashboard} />
      </Switch>
    </BrowserRouter>
  );
};

export default App;
