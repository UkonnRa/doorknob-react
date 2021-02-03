import React, {
  createContext,
  FunctionComponent,
  PropsWithChildren,
  useContext,
} from "react";
import {
  Configuration,
  ErrorContainer,
  LoginFlow,
  PublicApi,
  RecoveryFlow,
  RegistrationFlow,
  Session,
  SettingsFlow,
  VerificationFlow,
} from "@ory/kratos-client";

interface KratosService {
  whoami(): Promise<Session | undefined>;

  initLogin(flow: string | unknown): Promise<LoginFlow | undefined>;

  initRegister(flow: string | unknown): Promise<RegistrationFlow | undefined>;

  initSettings(flow: string | unknown): Promise<SettingsFlow | undefined>;

  initVerify(flow: string | unknown): Promise<VerificationFlow | undefined>;

  initRecover(flow: string | unknown): Promise<RecoveryFlow | undefined>;

  getError(error: string | unknown): Promise<ErrorContainer | undefined>;

  logout(): Promise<void>;
}

const Context = createContext<KratosService | null>(null);
const client = new PublicApi(
  new Configuration({ basePath: process.env.REACT_APP_KRATOS_PUBLIC_URL })
);

export const KratosProvider: FunctionComponent = ({
  children,
}: PropsWithChildren<unknown>) => {
  const whoami = (): Promise<Session | undefined> =>
    client.whoami().then(({ data }) => data);

  const initLogin = async (
    flow: string | unknown
  ): Promise<LoginFlow | undefined> => {
    const fallback = "/self-service/browser/flows/login";
    return await init(flow, fallback, (r) => client.getSelfServiceLoginFlow(r));
  };

  const initRegister = async (
    flow: string | unknown
  ): Promise<RegistrationFlow | undefined> => {
    const fallback = "/self-service/browser/flows/registration";
    return await init(flow, fallback, (r) =>
      client.getSelfServiceRegistrationFlow(r)
    );
  };

  const initSettings = async (
    flow: string | unknown
  ): Promise<SettingsFlow | undefined> => {
    const fallback = "/self-service/browser/flows/settings";
    return await init(flow, fallback, (r) =>
      client.getSelfServiceSettingsFlow(r)
    );
  };

  const initVerify = async (
    request: string | unknown
  ): Promise<VerificationFlow | undefined> => {
    const fallbackPath = "/self-service/browser/flows/verification/email";
    return await init(request, fallbackPath, (r) =>
      client.getSelfServiceVerificationFlow(r)
    );
  };

  const initRecover = async (
    request: string | unknown
  ): Promise<RecoveryFlow | undefined> => {
    const fallback = "/self-service/browser/flows/recovery";
    return await init(request, fallback, (r) =>
      client.getSelfServiceRecoveryFlow(r)
    );
  };

  const getError = async (
    error: string | unknown
  ): Promise<ErrorContainer | undefined> => {
    if (typeof error === "string") {
      try {
        const { data } = await client.getSelfServiceError(error);
        return data;
      } catch (e) {
        return undefined;
      }
    }

    return undefined;
  };

  const logout = async (): Promise<void> => {
    const { config } = await client.initializeSelfServiceBrowserLogoutFlow();
    window.location.assign(config.url ?? "/");
  };

  async function init<R>(
    request: string | unknown,
    fallbackPath: string,
    func: (request: string) => Promise<{ data: R; response?: any }>
  ): Promise<R | undefined> {
    const fallback = `${process.env.REACT_APP_KRATOS_PUBLIC_URL}${fallbackPath}`;
    if (typeof request !== "string") {
      window.location.assign(fallback);
      return;
    }

    try {
      const { data } = await func(request);
      return data;
    } catch (e) {
      window.location.assign(fallback);
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
        logout,
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
