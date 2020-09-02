import React, { FunctionComponent, useEffect } from "react";
import { useLocation } from "react-router-dom";
import qs from "query-string";
import { useLogger } from "../services";

export const HydraCallback: FunctionComponent = () => {
  const location = useLocation();
  const queries = qs.parse(location.search);
  const logger = useLogger();

  useEffect(() => {
    logger.info("HydraLogin start: ", queries);
  }, [logger, queries]);

  return <div>Hydra Callback</div>;
};
