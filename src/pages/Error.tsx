import React, { useEffect, useState } from "react";
import { FunctionComponent } from "react";
import qs from "query-string";
import { useLocation } from "react-router-dom";
import { ErrorContainer } from "@oryd/kratos-client";
import { useKratos, useLogger } from "../services";

export const Error: FunctionComponent = () => {
  const [body, setBody] = useState<ErrorContainer>();
  const location = useLocation();
  const { error } = qs.parse(location.search);
  const kratos = useKratos();
  const logger = useLogger();

  useEffect(() => {
    kratos
      .getError(error)
      .then((b) => {
        if (b) {
          setBody(b);
        }
      })
      .catch((err) => logger.error("Error: ", err));
  }, [kratos, logger, error]);

  return <>{body && <textarea value={JSON.stringify(body, null, 2)} />}</>;
};
