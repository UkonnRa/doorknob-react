import React, { FunctionComponent, useEffect } from "react";
import { useAuth, useKratos } from "../services";

export const Callback: FunctionComponent = () => {
  const auth = useAuth();
  const kratos = useKratos();

  useEffect(() => {
    kratos.client
      .whoami()
      .then(() => {
        auth.setAuthed(true);
        auth.setReferer();
        window.location.href = auth.getReferer() ?? "/";
      })
      .catch((e) => {
        console.error("Error: ", e);
        auth.setAuthed(false);
        auth.setReferer();
      });
  }, [auth, kratos.client]);

  return <div>Callback</div>;
};
