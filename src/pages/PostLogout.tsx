import React, { FunctionComponent, useEffect } from "react";
import { useKratos } from "../services";
import { CircularProgress } from "@material-ui/core";

export const PostLogout: FunctionComponent = () => {
  const { logout } = useKratos();

  useEffect(() => {
    logout().catch((err) => console.error("Error on hydra callback: ", err));
  }, [logout]);

  return <CircularProgress />;
};
