import React, { createContext, FunctionComponent, useContext } from "react";
import {
  ErrorContainer,
  LoginRequest,
  PublicApi,
  RecoveryRequest,
  RegistrationRequest,
  Session,
  SettingsRequest,
  VerificationRequest,
} from "@oryd/kratos-client";
import { IncomingMessage } from "http";

interface KratosService {
  whoami(): Promise<Session | undefined>;
  initLogin(request: string | unknown): Promise<LoginRequest | undefined>;
  initRegister(
    request: string | unknown
  ): Promise<RegistrationRequest | undefined>;
  initSettings(request: string | unknown): Promise<SettingsRequest | undefined>;
  initVerify(
    request: string | unknown
  ): Promise<VerificationRequest | undefined>;
  initRecover(request: string | unknown): Promise<RecoveryRequest | undefined>;
  getError(error: string | unknown): Promise<ErrorContainer | undefined>;
}

const Context = createContext<KratosService | null>(null);
const client = new PublicApi(process.env.REACT_APP_KRATOS_PUBLIC_URL);

export const KratosProvider: FunctionComponent = ({ children }) => {
  const whoami = (): Promise<Session | undefined> =>
    client.whoami().then(({ body }) => body);

  const initLogin = async (
    request: string | unknown
  ): Promise<LoginRequest | undefined> => {
    const fallback = "/self-service/browser/flows/login";
    return await init(request, fallback, (r) =>
      client.getSelfServiceBrowserLoginRequest(r)
    );
  };

  const initRegister = async (
    request: string | unknown
  ): Promise<RegistrationRequest | undefined> => {
    const fallback = "/self-service/browser/flows/registration";
    return await init(request, fallback, (r) =>
      client.getSelfServiceBrowserRegistrationRequest(r)
    );
  };

  const initSettings = async (
    request: string | unknown
  ): Promise<SettingsRequest | undefined> => {
    const fallback = "/self-service/browser/flows/settings";
    return await init(request, fallback, (r) =>
      client.getSelfServiceBrowserSettingsRequest(r)
    );
  };

  const initVerify = async (
    request: string | unknown
  ): Promise<VerificationRequest | undefined> => {
    const fallbackPath = "/self-service/browser/flows/verification/email";
    return await init(request, fallbackPath, (r) =>
      client.getSelfServiceVerificationRequest(r)
    );
  };

  const initRecover = async (
    request: string | unknown
  ): Promise<RecoveryRequest | undefined> => {
    const fallback = "/self-service/browser/flows/recovery";
    return await init(request, fallback, (r) =>
      client.getSelfServiceBrowserRecoveryRequest(r)
    );
  };

  const getError = async (
    error: string | unknown
  ): Promise<ErrorContainer | undefined> =>
    init(error, "/", (e) => client.getSelfServiceError(e));

  async function init<R>(
    request: string | unknown,
    fallbackPath: string,
    func: (request: string) => Promise<{ body: R; response: IncomingMessage }>
  ): Promise<R | undefined> {
    const fallback = `${process.env.REACT_APP_KRATOS_PUBLIC_URL}${fallbackPath}`;
    if (typeof request !== "string") {
      window.location.assign(fallback);
      return;
    }

    const { body, response } = await func(request);
    if (!response.statusCode || response.statusCode / 100 !== 2) {
      window.location.assign(fallback);
    } else {
      return body;
    }
  }

  return (
    <Context.Provider
      value={{
        whoami,
        initLogin,
        initRegister,
        initSettings,
        initVerify,
        initRecover,
        getError,
      }}
    >
      {children}
    </Context.Provider>
  );
};

export const useKratos = (): KratosService => {
  const service = useContext(Context);
  if (!service) {
    throw Error("Please initialize `KratosProvider` before `useKratos`");
  }
  return service;
};
