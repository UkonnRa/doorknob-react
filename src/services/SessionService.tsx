import React, { createContext, useContext, useEffect, useState } from "react";
import { Session } from "@oryd/kratos-client";
import { useKratos } from "./KratosService";
import { useAuth } from "./AuthService";

const SessionContext = createContext<Session | null>(null);

export const useSession = (): Session | null => useContext(SessionContext);

export const SessionProvider: React.FunctionComponent = ({ children }) => {
  const [session, setSession] = useState(new Session());
  const kratos = useKratos();
  const auth = useAuth();

  useEffect(() => {
    auth.getAuthed() &&
      kratos.client
        .whoami()
        .then(({ body }) => {
          console.log("Session Service: body: ", body);
          const now = new Date();
          const expiry = body.expiresAt;
          if (now > expiry) {
            return auth.refresh();
          } else {
            setSession(body);
          }
        })
        .catch((error) => {
          auth.setAuthed(false);
          console.error(error);
          auth.login(false);
        });
  }, []);

  return (
    <SessionContext.Provider value={session}>
      {children}
    </SessionContext.Provider>
  );
};
