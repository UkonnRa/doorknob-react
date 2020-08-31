import React, { createContext, FunctionComponent, useContext } from "react";
import {
  LoginRequest,
  PublicApi,
  RecoveryRequest,
  RegistrationRequest,
  SettingsRequest,
  VerificationRequest,
} from "@oryd/kratos-client";
import { IncomingMessage } from "http";

interface KratosService {
  client: PublicApi;
  initLogin(request: string | unknown): Promise<LoginRequest | undefined>;
  initRegister(
    request: string | unknown
  ): Promise<RegistrationRequest | undefined>;
  initSettings(request: string | unknown): Promise<SettingsRequest | undefined>;
  initVerify(
    request: string | unknown
  ): Promise<VerificationRequest | undefined>;
  initRecover(request: string | unknown): Promise<RecoveryRequest | undefined>;
}

const KratosContext = createContext<KratosService | null>(null);
const client = new PublicApi(process.env.REACT_APP_KRATOS_PUBLIC_URL);

export const KratosProvider: FunctionComponent = (props) => {
  const value: KratosService = {
    client,
    initLogin,
    initRegister,
    initSettings,
    initVerify,
    initRecover,
  };
  return (
    <KratosContext.Provider value={value}>
      {props.children}
    </KratosContext.Provider>
  );
};

export const useKratos = (): KratosService => {
  const service = useContext(KratosContext);
  if (!service) {
    throw Error("Please initialize `KratosProvider` before `useKratos`");
  }
  return service;
};

const initLogin = async (
  request: string | unknown
): Promise<LoginRequest | undefined> => {
  const fallback = `/self-service/browser/flows/login?return_to=${process.env.REACT_APP_BASE_URL}/callback`;
  return await init(request, fallback, (r) =>
    client.getSelfServiceBrowserLoginRequest(r)
  );
};

const initRegister = async (
  request: string | unknown
): Promise<RegistrationRequest | undefined> => {
  const fallback = `/self-service/browser/flows/registration?return_to=${process.env.REACT_APP_BASE_URL}/callback`;
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
  const fallbackPath = "/self-service/browser/flows/verification/init/email";
  return await init(request, fallbackPath, (r) =>
    client.getSelfServiceBrowserLoginRequest(r)
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

async function init<R>(
  request: string | unknown,
  fallbackPath: string,
  func: (request: string) => Promise<{ body: R; response: IncomingMessage }>
): Promise<R | undefined> {
  const fallback = `${process.env.REACT_APP_KRATOS_PUBLIC_URL}${fallbackPath}`;
  console.log("KratosService: fallback: ", fallback);
  console.log("KratosService: request: ", request);
  if (typeof request !== "string") {
    window.location.assign(fallback);
    return;
  }

  const { body, response } = await func(request);
  console.log("KratosService: body: ", body);
  console.log("KratosService: response: ", response.statusCode);
  if (!response.statusCode || response.statusCode / 100 !== 2) {
    window.location.assign(fallback);
  } else {
    return body;
  }
}
