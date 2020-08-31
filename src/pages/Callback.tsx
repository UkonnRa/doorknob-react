import React, { FunctionComponent, useEffect } from "react";
import { useAuth, useKratos, useLogger } from "../services";

export const Callback: FunctionComponent = () => {
  const auth = useAuth();
  const kratos = useKratos();
  const logger = useLogger();

  useEffect(() => {
    kratos.client
      .whoami()
      .then(() => {
        auth.setAuthed(true);
        auth.setReferer();
        window.location.href = auth.getReferer() ?? "/";
      })
      .catch((e) => {
        logger.error("Callback with Error: ", e);
        auth.setAuthed(false);
        auth.setReferer();
      });
  }, [auth, kratos.client, logger]);

  return <div>Callback</div>;
};
