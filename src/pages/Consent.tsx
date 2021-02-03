import React, { FunctionComponent, useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { useLogger } from "../services";
import { ConsentData } from "../models";
import { ConsentForm } from "../components";

export const Consent: FunctionComponent = () => {
  const [body, setBody] = useState<ConsentData>();
  const location = useLocation();
  const logger = useLogger();

  useEffect(() => {
    fetch(`${process.env.REACT_APP_BACKEND_URL}/consent${location.search}`)
      .then((resp) => {
        if (resp.redirected) {
          window.location.assign(resp.url);
        } else {
          return resp.json().then((b: ConsentData) => {
            setBody(b);
          });
        }
      })
      .catch((err) => logger.error("Error: ", err));
  }, [location.search, logger]);

  return <ConsentForm data={body} />;
};
