import React from "react";
import { createContext, FunctionComponent, useContext } from "react";
import winston from "winston";
import { BrowserConsole } from "../utils";

const LoggerContext = createContext<winston.Logger | null>(null);

export const LoggerProvider: FunctionComponent = (props) => {
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

  return (
    <LoggerContext.Provider value={logger}>
      {props.children}
    </LoggerContext.Provider>
  );
};

export const useLogger = (): winston.Logger => {
  const service = useContext(LoggerContext);
  if (!service) {
    throw Error("Please initialize `LoggerProvider` before `useLogger`");
  }
  return service;
};
