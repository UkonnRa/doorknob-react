import React, { FunctionComponent, useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { useLogger } from "../services";
import { OAuth2Client } from "@oryd/hydra-client";

type ConsentData = {
  challenge: string;
  requested_scope: string[];
  user: string;
  client: OAuth2Client;
};

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
          return resp.json().then((b) => setBody(b));
        }
      })
      .catch((err) => logger.error("Error: ", err));
  }, [location.search, logger]);

  const render = () => {
    if (!body) {
      return <div>Loading...</div>;
    } else {
      return (
        <form
          action={`${process.env.REACT_APP_BACKEND_URL}/post-consent`}
          method="POST"
        >
          <input
            readOnly
            type="text"
            hidden={true}
            value={body?.challenge}
            name="challenge"
          />

          <div>requested scopes:</div>
          {body.requested_scope.map((s) => (
            <label key={s}>
              <span>{s}</span>
              <input type="checkbox" value={s} name="scopes" />
            </label>
          ))}

          {body.client.policyUri && (
            <div>
              <a href={body.client.policyUri}>Read the Privacy Policy</a>
            </div>
          )}
          {body.client.tosUri && (
            <div>
              <a href={body.client.tosUri}>Terms of Service</a>
            </div>
          )}

          <div>
            <label>
              <span>Do not ask me again</span>
              <input
                type="checkbox"
                id="remember"
                value="true"
                name="remember"
              />
            </label>
          </div>

          <button type="submit" id="accept" name="submit" value="true">
            Allow access
          </button>
          <button type="submit" id="accept" name="submit" value="false">
            Deny access
          </button>
        </form>
      );
    }
  };

  return render();
};
