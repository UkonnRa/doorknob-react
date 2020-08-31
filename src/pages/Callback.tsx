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
      auth.dispatch({ type: "SET_AUTH" });
      auth.dispatch({ type: "UNSET_REFERER" });
      window.location.assign(auth.state.referer || "/");
    } catch (e) {
      auth.dispatch({ type: "UNSET_AUTH" });
      auth.dispatch({ type: "UNSET_REFERER" });
    }
  }, [auth, kratos.client]);

  useEffect(() => {
    console.log("init Callback");
    init().catch((err) => console.error("Error: ", err));
  });

  return <div>Callback</div>;
};
