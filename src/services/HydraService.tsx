import React, {createContext, FunctionComponent, useContext} from "react";
import {PublicApi, Session} from "@oryd/kratos-client";
import {useKratos} from "./KratosService";
import {useLogger} from "./LoggerService";
import {randomBytes} from "crypto";
import qs from "query-string";
import Cookies from "js-cookie";
import {
  AcceptLoginRequest,
  AdminApi as HydraAdminApi
} from "@oryd/hydra-client";

interface HydraService {
  initLogin(): Promise<void>;

  login(challenge: string, state?: string): Promise<void>;

  createSession(requestedScopes: string[], context: Session): Promise<unknown>;

  getConsent(challenge: string): Promise<void>;

  postConsent(challenge: string): Promise<void>;
}

const HydraContext = createContext<HydraService | null>(null);
const client = new HydraAdminApi(process.env.REACT_APP_HYDRA_ADMIN_URL);

const KEY_LOGIN_STATE = "hydra.loginState";

export const HydraProvider: FunctionComponent = ({children}) => {
  const kratos = useKratos();
  const logger = useLogger();

  const initLogin = async (): Promise<void> => {
    logger.info("Initiating ORY Kratos Login flow because neither a ORY Kratos Login Request nor a valid ORY Kratos Session was found");
    const state = randomBytes(48).toString("hex");
    window.sessionStorage.setItem(KEY_LOGIN_STATE, state);
    const returnTo = qs.stringifyUrl({
      url: process.env.REACT_APP_BASE_URL ?? "",
      query: {
        hydra_login_state: state,
      }
    });
    const redirectTo = qs.stringifyUrl({
      url: `${process.env.REACT_APP_KRATOS_PUBLIC_URL}/self-service/browser/flows/login`,
      query: {
        refresh: "true",
        return_to: returnTo,
      }
    });

    window.location.assign(redirectTo);

    return;
  };

  const login = async (challenge: string, state?: string): Promise<void> => {
    const {body} = await client.getLoginRequest(challenge);
    if (body.skip) {
      const acceptLoginRequest = new AcceptLoginRequest();
      acceptLoginRequest.subject = body.subject;

      logger.debug("Accepting ORY Hydra Login Request because skip is true", acceptLoginRequest);
      const resp = await client.acceptLoginRequest(challenge, acceptLoginRequest);
      window.location.assign(resp.body.redirectTo);
      return;
    }

    if (!state) {
      logger.debug("Redirecting to login page because hydra_login_state was not found in the HTTP URL query parameters");
      return await initLogin();
    }

    const kratosSessionCookie = Cookies.get("ory_kratos_session");
    if (!kratosSessionCookie) {
      logger.debug("Redirecting to login page because no ORY Kratos session cookie was set");
      return await initLogin();
    }

    if (state !== sessionStorage.getItem(KEY_LOGIN_STATE)) {
      logger.debug("Redirecting to login page because login states do not match");
      return await initLogin();
    }

    const resp = await kratos.client.whoami();
    const subject = resp.body.identity.id;
    const acceptLoginRequest = new AcceptLoginRequest();
    acceptLoginRequest.subject = subject;
    acceptLoginRequest.context = resp.body;

    const acceptResp = await client.acceptLoginRequest(challenge, acceptLoginRequest);
    window.location.assign(acceptResp.body.redirectTo);

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
