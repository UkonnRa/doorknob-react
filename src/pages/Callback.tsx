import React, { FunctionComponent, useCallback, useEffect } from "react";
import { useAuth, useKratos } from "../services";

export const Callback: FunctionComponent = () => {
  const auth = useAuth();
  const kratos = useKratos();
  const init = useCallback(async () => {
    try {
      const { response, body } = await kratos.client.whoami();
      console.log("Whoami: response: ", response);
      console.log("Whoami: body: ", body);
      auth.setAuthed(true);
      auth.setReferer();
      window.location.href = "/";
    } catch (e) {
      console.error("Error: ", e);
      auth.setAuthed(false);
      auth.setReferer();
    }
  }, []);

  useEffect(() => {
    console.log("init Callback");
    init().finally();
  }, []);

  return <div>Callback</div>;
};
