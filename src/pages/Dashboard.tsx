import React, { FunctionComponent, useEffect } from "react";
import { useAuth, useSession } from "../services";

export const Dashboard: FunctionComponent = () => {
  const auth = useAuth();
  const session = useSession();
  const user = session?.identity?.traits;

  useEffect(() => {
    if (!auth.state.isAuthenticated) auth.login(true);
  }, [auth]);

  if (!user) return null;

  return <div>{JSON.stringify(user)}</div>;
};
