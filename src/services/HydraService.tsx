import React, { createContext, FunctionComponent, useContext } from "react";
import { PublicApi, Session } from "@oryd/kratos-client";
import { useKratos } from "./KratosService";
import { useLogger } from "./LoggerService";

interface HydraService {
  initLogin(): Promise<void>;
  login(challenge: string): Promise<void>;
  createSession(requestedScopes: string[], context: Session): Promise<unknown>;
  getConsent(challenge: string): Promise<void>;
  postConsent(challenge: string): Promise<void>;
}

const HydraContext = createContext<HydraService | null>(null);
const client = new PublicApi(process.env.REACT_APP_HYDRA_ADMIN_URL);

export const HydraProvider: FunctionComponent = ({ children }) => {
  const kratos = useKratos();
  const logger = useLogger();

  const initLogin = async (): Promise<void> => {
    return;
  };

  const login = async (challenge: string): Promise<void> => {
    return;
  };

  const createSession = async (
    requestedScopes: string[],
    context: Session
  ): Promise<void> => {
    return;
  };

  const getConsent = async (challenge: string): Promise<void> => {
    return;
  };

  const postConsent = async (challenge: string): Promise<void> => {
    return;
  };

  return (
    <HydraContext.Provider
      value={{
        initLogin,
        login,
        createSession,
        getConsent,
        postConsent,
      }}
    >
      {children}
    </HydraContext.Provider>
  );
};

export const useHydra = (): HydraService => {
  const service = useContext(HydraContext);
  if (!service) {
    throw Error("Please initialize `HydraProvider` before `useHydra`");
  }
  return service;
};
