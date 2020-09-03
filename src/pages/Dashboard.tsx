import React, { FunctionComponent, useEffect, useState } from "react";
import { useLogger, useSession } from "../services";
import { useLocation } from "react-router-dom";
import qs from "query-string";

type AuthInfo = {
  code: string;
  scope: string[];
  state: string;
};

export const Dashboard: FunctionComponent = () => {
  const session = useSession();
  const location = useLocation();
  const { code, scope, state } = qs.parse(location.search);
  const [authInfo, setAuthInfo] = useState<AuthInfo | undefined>(undefined);
  const logger = useLogger();

  useEffect(() => {
    if (!code || typeof code !== "string") {
      logger.error("`code` not found");
      return;
    }

    if (!scope || typeof scope !== "string") {
      logger.error("`scope` not found");
      return;
    }

    if (!state || typeof state !== "string") {
      logger.error("`state` not found");
      return;
    }

    setAuthInfo({ code, scope: scope.split(" "), state });
  }, [code, logger, scope, session, state]);

  if (!authInfo) return <div>No authInfo</div>;

  return <div>{JSON.stringify(authInfo)}</div>;
};
