import React, { useEffect, useState } from "react";
import { FunctionComponent } from "react";
import qs from "query-string";
import { useLocation } from "react-router-dom";
import { SettingsRequest } from "@oryd/kratos-client";
import { useKratos, useLogger } from "../services";
import { KratosForm, KratosMessages } from "../components";

export const Settings: FunctionComponent = () => {
  const [body, setBody] = useState<SettingsRequest>();
  const location = useLocation();
  const { request } = qs.parse(location.search);
  const kratos = useKratos();
  const logger = useLogger();

  useEffect(() => {
    kratos
      .initSettings(request)
      .then((b) => {
        if (b) {
          console.log("request: ", b);
          setBody(b);
        }
      })
      .catch((err) => logger.error("Error: ", err));
  }, [kratos, logger, request]);

  const profileSettings = body?.methods?.profile?.config;
  const passwordSettings = body?.methods?.password?.config;
  const oidcSettings = body?.methods?.oidc?.config;

  return (
    <>
      {body?.messages && <KratosMessages messages={body.messages} />}
      {body?.state === "success" && <p>Your changes have been saved!</p>}
      {profileSettings && (
        <div>
          <h3>Profile</h3>
          {profileSettings.messages && (
            <KratosMessages messages={profileSettings.messages} />
          )}
          <KratosForm
            submitLabel="Profile Settings"
            actionURL={profileSettings.action}
            fields={profileSettings.fields}
            messages={profileSettings.messages}
            title={"Profile Settings"}
          />
        </div>
      )}
      {passwordSettings && (
        <div>
          <h3>Profile</h3>
          {passwordSettings.messages && (
            <KratosMessages messages={passwordSettings.messages} />
          )}
          <KratosForm
            submitLabel="Password Settings"
            actionURL={passwordSettings.action}
            fields={passwordSettings.fields}
            messages={passwordSettings.messages}
            title={"Password Settings"}
          />
        </div>
      )}
      {oidcSettings && (
        <div>
          <h3>OIDC</h3>
          {oidcSettings.messages && (
            <KratosMessages messages={oidcSettings.messages} />
          )}
          <KratosForm
            submitLabel="OIDC Settings"
            actionURL={oidcSettings.action}
            fields={oidcSettings.fields}
            messages={oidcSettings.messages}
            title={"OIDC Settings"}
          />
        </div>
      )}
    </>
  );
};
