import React, { useEffect } from "react";
import { FunctionComponent } from "react";
import { useHydra, useLogger } from "../services";
import { useLocation } from "react-router-dom";
import qs from "query-string";

export const HydraLogin: FunctionComponent = () => {
  const location = useLocation();
  const queries = qs.parse(location.search);
  const logger = useLogger();
  const hydra = useHydra();

  useEffect(() => {
    logger.info("HydraLogin start: ", queries);
    const challenge = queries["login_challenge"];
    const state = queries["hydra_login_state"];
    if (!challenge || typeof challenge !== "string") {
      window.location.assign("/");
      throw Error(
        "ORY Hydra Login flow could not be completed because no ORY Hydra Login Challenge was found in the HTTP request"
      );
    }

    if (!state || typeof state !== "string") {
      window.location.assign("/");
      hydra.initLogin(challenge);
      return;
    }

    hydra.login(challenge, state);
  }, [hydra, logger, queries]);

  return <div>Loading Hydra config...</div>;
};
