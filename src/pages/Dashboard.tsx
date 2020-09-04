import React, { FunctionComponent, useEffect } from "react";
import { useReactOidc } from "@axa-fr/react-oidc-context";

export const Dashboard: FunctionComponent = () => {
  const { oidcUser } = useReactOidc();

  useEffect(() => {
    console.log("user: ", oidcUser);
  }, [oidcUser]);

  return <div>Dash</div>;
};
