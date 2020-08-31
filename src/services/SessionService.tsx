import React, { createContext, useContext, useEffect, useState } from "react";
import { Session } from "@oryd/kratos-client";
import { useKratos } from "./KratosService";
import { useAuth } from "./AuthService";

const SessionContext = createContext<Session | null>(null);

export const useSession = (): Session | null => useContext(SessionContext);

export const SessionProvider: React.FunctionComponent = ({ children }) => {
  const [session, setSession] = useState<Session | null>(null);
  const kratos = useKratos();
  const auth = useAuth();

  useEffect(() => {
    auth.state.isAuthenticated &&
      kratos.client
        .whoami()
        .then(({ body }) => {
          const now = new Date();
          const expiry = body.expiresAt;
          if (now > expiry) return auth.refresh();
          else setSession(body);
        })
        .catch((error) => {
          auth.dispatch({ type: "UNSET_AUTH" });
          console.log(error);
          auth.login(false);
        });
  }, [auth, kratos.client]);

  return (
    <SessionContext.Provider value={session}>
      {children}
    </SessionContext.Provider>
  );
};
