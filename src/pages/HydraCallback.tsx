import React, { FunctionComponent, useEffect } from "react";
import { useLocation } from "react-router-dom";
import qs from "query-string";
import { useLogger } from "../services";

export const HydraCallback: FunctionComponent = () => {
  const location = useLocation();
  const queries = qs.parse(location.search);
  const logger = useLogger();

  useEffect(() => {
    const url = qs.stringifyUrl({
      url: `${process.env.REACT_APP_BACKEND_URL}/login`,
      query: queries,
    });

    fetch(url)
      .then((resp) => window.location.assign(resp.url))
      .catch((err) => logger.error("Error on hydra callback: ", err));
  }, [logger, queries]);

  return <div>Hydra Callback</div>;
};
