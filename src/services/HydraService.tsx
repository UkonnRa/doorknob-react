import React, { createContext, FunctionComponent, useContext } from "react";
import { PublicApi, Session } from "@oryd/kratos-client";
import { useKratos } from "./KratosService";
import { useLogger } from "./LoggerService";
import { randomBytes } from "crypto";
import qs from "query-string";
import Cookies from "js-cookie";
import {
  AcceptLoginRequest,
  AdminApi as HydraAdminApi,
  OAuth2Client,
} from "@oryd/hydra-client";

interface HydraService {
  tryCreateClient(): Promise<void>;

  initLogin(challenge: string): Promise<void>;

  login(challenge: string, state?: string): Promise<void>;

  createSession(requestedScopes: string[], context: Session): Promise<unknown>;

  getConsent(challenge: string): Promise<void>;

  postConsent(challenge: string): Promise<void>;
}

const HydraContext = createContext<HydraService | null>(null);
const client = new HydraAdminApi(process.env.REACT_APP_HYDRA_ADMIN_URL);

const KEY_LOGIN_STATE = "hydra.loginState";

export const HydraProvider: FunctionComponent = ({ children }) => {
  const kratos = useKratos();
  const logger = useLogger();

  const tryCreateClient = async (): Promise<void> => {
    await client.deleteOAuth2Client("absolem");
    await client.deleteOAuth2Client("absolem-ui");

    const absolemClient = new OAuth2Client();
    absolemClient.clientId = "absolem";
    absolemClient.clientName = "Absolem Backend Client";
    absolemClient.clientSecret = "test-secret";
    absolemClient.grantTypes = ["client_credentials"];
    absolemClient.responseTypes = ["code"];
    absolemClient.scope = "openid offline";

    const absolemUiClient = new OAuth2Client();
    absolemUiClient.clientId = "absolem-ui";
    absolemUiClient.clientName = "Absolem Frontend Client";
    absolemUiClient.clientSecret = "test-secret";
    absolemUiClient.redirectUris = ["http://localhost:3000/hydra/callback"];
    absolemUiClient.grantTypes = ["authorization_code", "refresh_token"];
    absolemUiClient.responseTypes = ["code"];
    absolemUiClient.scope = "openid offline profile:read";

    const absolemResp = await client.createOAuth2Client(absolemClient);
    logger.debug("absolemResp: ", absolemResp);

    const absolemUiResp = await client.createOAuth2Client(absolemUiClient);
    logger.debug("absolemUiResp: ", absolemUiResp);
  };

  const initLogin = async (challenge: string): Promise<void> => {
    logger.debug(
      "Initiating ORY Kratos Login flow because neither a ORY Kratos Login Request nor a valid ORY Kratos Session was found"
    );
    const state = randomBytes(48).toString("hex");
    window.sessionStorage.setItem(KEY_LOGIN_STATE, state);
    const returnTo = qs.stringifyUrl({
      url: `${process.env.REACT_APP_BASE_URL}/hydra/login`,
      query: {
        hydra_login_state: state,
        login_challenge: challenge,
      },
    });
    logger.debug(`Hydra returnTo: ${returnTo}`);

    const redirectTo = qs.stringifyUrl({
      url: `${process.env.REACT_APP_KRATOS_PUBLIC_URL}/self-service/browser/flows/login`,
      query: {
        refresh: "true",
        return_to: returnTo,
      },
    });
    logger.debug(`Hydra redirectTo: ${redirectTo}`);

    window.location.assign(redirectTo);
  };

  const login = async (challenge: string, state?: string): Promise<void> => {
    logger.debug(`Hydra login: challenge: ${challenge}, state: ${state}`);
    const { body } = await client.getLoginRequest(challenge);
    logger.debug("Hydra login: login request: ", body);
    if (body.skip) {
      const acceptLoginRequest = new AcceptLoginRequest();
      acceptLoginRequest.subject = body.subject;

      logger.debug(
        "Accepting ORY Hydra Login Request because skip is true",
        acceptLoginRequest
      );
      const resp = await client.acceptLoginRequest(
        challenge,
        acceptLoginRequest
      );
      window.location.assign(resp.body.redirectTo);
      return;
    }

    if (!state) {
      logger.debug(
        "Redirecting to login page because hydra_login_state was not found in the HTTP URL query parameters"
      );
      return await initLogin(challenge);
    }

    const kratosSessionCookie = Cookies.get("ory_kratos_session");
    if (!kratosSessionCookie) {
      logger.debug(
        "Redirecting to login page because no ORY Kratos session cookie was set"
      );
      return await initLogin(challenge);
    }

    if (state !== sessionStorage.getItem(KEY_LOGIN_STATE)) {
      logger.debug(
        "Redirecting to login page because login states do not match"
      );
      return await initLogin(challenge);
    }

    const resp = await kratos.client.whoami();
    logger.debug("Hydra login: whoami: ", resp);
    const subject = resp.body.identity.id;
    const acceptLoginRequest = new AcceptLoginRequest();
    acceptLoginRequest.subject = subject;
    acceptLoginRequest.context = resp.body;

    const acceptResp = await client.acceptLoginRequest(
      challenge,
      acceptLoginRequest
    );
    logger.debug("Hydra login: acceptResp: ", acceptResp);
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
        tryCreateClient,
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
