import React, { FunctionComponent, useEffect } from "react";
import { useLocation } from "react-router-dom";
import qs from "query-string";
import { CircularProgress } from "@material-ui/core";

export const Callback: FunctionComponent = () => {
  const location = useLocation();
  const query = qs.parse(location.search);

  useEffect(() => {
    window.location.assign(
      qs.stringifyUrl({ url: query.error ? "/error" : "/", query })
    );
  }, [query]);

  return <CircularProgress />;
};
