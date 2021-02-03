import React, { useEffect, useState } from "react";
import { FunctionComponent } from "react";
import qs from "query-string";
import { useLocation } from "react-router-dom";
import { SettingsFlow } from "@ory/kratos-client";
import { useKratos, useLogger } from "../services";
import { KratosForm, KratosMessages } from "../components";
import { useTranslation } from "react-i18next";
import { makeStyles } from "@material-ui/core/styles";
import { createStyles, Theme } from "@material-ui/core";

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    card: {
      marginBottom: theme.spacing(1),
    },
  })
);

export const Settings: FunctionComponent = () => {
  const [body, setBody] = useState<SettingsFlow>();
  const location = useLocation();
  const { flow } = qs.parse(location.search);
  const kratos = useKratos();
  const logger = useLogger();
  const { t } = useTranslation();
  const classes = useStyles();

  useEffect(() => {
    kratos
      .initSettings(flow)
      .then((b) => b && setBody(b))
      .catch((err) => logger.error("Error: ", err));
  }, [kratos, logger, flow]);

  const profileSettings = body?.methods?.profile?.config;
  const passwordSettings = body?.methods?.password?.config;
  const oidcSettings = body?.methods?.oidc?.config;

  return (
    <>
      {body?.messages && <KratosMessages messages={body.messages} />}
      {body?.state === "success" && <p>{t("SETTINGS_HINTS.UPDATE_SUCCESS")}</p>}
      {profileSettings && (
        <div className={classes.card}>
          {profileSettings.messages && (
            <KratosMessages messages={profileSettings.messages} />
          )}
          <KratosForm
            submitLabel={t("SUBMIT")}
            actionURL={profileSettings.action}
            fields={profileSettings.fields}
            messages={profileSettings.messages}
            title={t("PROFILE_SETTINGS")}
            titleMenu={<></>}
          />
        </div>
      )}
      {passwordSettings && (
        <div className={classes.card}>
          {passwordSettings.messages && (
            <KratosMessages messages={passwordSettings.messages} />
          )}
          <KratosForm
            submitLabel={t("SUBMIT")}
            actionURL={passwordSettings.action}
            fields={passwordSettings.fields}
            messages={passwordSettings.messages}
            title={t("PASSWORD_SETTINGS")}
            titleMenu={<></>}
          />
        </div>
      )}
      {oidcSettings && (
        <div className={classes.card}>
          {oidcSettings.messages && (
            <KratosMessages messages={oidcSettings.messages} />
          )}
          <KratosForm
            submitLabel={t("SUBMIT")}
            actionURL={oidcSettings.action}
            fields={oidcSettings.fields}
            messages={oidcSettings.messages}
            title={t("OIDC_SETTINGS")}
            titleMenu={<></>}
          />
        </div>
      )}
    </>
  );
};
