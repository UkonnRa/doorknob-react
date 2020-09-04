import React, { FunctionComponent, useEffect } from "react";
import { useLocation } from "react-router-dom";
import { useReactOidc } from "@axa-fr/react-oidc-context";

export const Callback: FunctionComponent = () => {
  const location = useLocation();
  const { oidcUser } = useReactOidc();
  const { profile } = oidcUser;

  useEffect(() => {
    console.log("location: ", location);
    console.log("user: ", profile);
  }, [location, profile]);

  return <div>Callback</div>;
};
