import React, { useEffect, useState } from "react";
import { FunctionComponent } from "react";
import qs from "query-string";
import { useLocation } from "react-router-dom";
import { useKratos, useLogger } from "../services";
import { useTranslation } from "react-i18next";

export const Error: FunctionComponent = () => {
  const [errorId, setErrorId] = useState<string>();
  const [errorBody, setErrorBody] = useState<string>();
  const location = useLocation();
  const { error, error_description } = qs.parse(location.search);
  const { t } = useTranslation();
  const kratos = useKratos();
  const logger = useLogger();

  useEffect(() => {
    if (typeof error !== "string") {
      window.location.assign("/");
      return;
    }

    kratos
      .getError(error)
      .then((b) => {
        if (b && b.id) {
          setErrorId(b.id);
          const info = t(b.id);
          if (info !== b.id) {
            setErrorBody(info);
          }
        } else {
          const info = t(error);
          if (info !== error) {
            setErrorBody(info);
            return;
          }

          if (typeof error_description !== "string") {
            window.location.assign("/");
            return;
          }

          setErrorBody(error_description);
        }
      })
      .then(() => new Promise((resolve) => setTimeout(() => resolve(), 5000)))
      .then(() => kratos.logout())
      .catch((err) => logger.error("Error: ", err));
  }, [kratos, logger, error, t, error_description]);

  return (
    <div>
      <h1>
        <strong>Error: </strong>
        {errorId}
      </h1>
      <div>{errorBody}</div>
      <div>Will redirect to login page after 5 seconds</div>
    </div>
  );
};
