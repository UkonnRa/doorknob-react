import React, { FunctionComponent, useEffect } from "react";
import { useLocation } from "react-router-dom";
import qs from "query-string";
import { useKratos, useLogger } from "../services";
import { ObjectSerializer as KratosSerializer } from "@oryd/kratos-client";
import { CircularProgress } from "@material-ui/core";

export const HydraPostCallback: FunctionComponent = () => {
  const location = useLocation();
  const queries = qs.parse(location.search);
  const logger = useLogger();
  const kratos = useKratos();

  useEffect(() => {
    const challenge = queries.challenge;
    logger.info(`Post login page: ${challenge}`);

    if (!challenge || typeof challenge !== "string") {
      logger.info(
        "HydraPostCallback: challenge is invalid, please login and retry"
      );
      window.location.assign("/");
      return;
    }

    kratos
      .whoami()
      .then((body) => {
        const url = qs.stringifyUrl({
          url: `${process.env.REACT_APP_BACKEND_URL}/post-login`,
          query: { challenge },
        });

        return fetch(url, {
          method: "POST",
          body: JSON.stringify(KratosSerializer.serialize(body, "Session")),
        });
      })
      .then((resp) => window.location.assign(resp.url))
      .catch((err) => logger.error("Error: ", err));
  }, [kratos, logger, queries]);

  return <CircularProgress />;
};
