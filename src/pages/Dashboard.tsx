import React, { FunctionComponent } from "react";
import { useReactOidc } from "@axa-fr/react-oidc-context";

export const Dashboard: FunctionComponent = () => {
  const { oidcUser, logout } = useReactOidc();

  return <div>
    <button onClick={() => logout()}>logout</button>
    <textarea readOnly value={JSON.stringify(oidcUser, null, 2)} />
  </div>;
};
