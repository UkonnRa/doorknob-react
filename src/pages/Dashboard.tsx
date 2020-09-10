import React, { FunctionComponent } from "react";
import { useAuth } from "oidc-react";
import { Link } from "@material-ui/core";

export const Dashboard: FunctionComponent = () => {
  const auth = useAuth();

  return (
    <>
      <textarea readOnly value={JSON.stringify(auth?.userData, null, 2)} />
      <button onClick={() => auth?.signOutRedirect()}>logout</button>
      <Link href="/settings">Settings</Link>
    </>
  );
};
