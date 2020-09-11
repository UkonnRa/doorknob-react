import React, { FunctionComponent, useEffect, useState } from "react";
import { useAuth } from "oidc-react";
import { Card, CardContent, CardHeader, createStyles } from "@material-ui/core";
import { Session } from "@oryd/kratos-client";
import { useKratos } from "../services";
import { makeStyles } from "@material-ui/core/styles";
import { useTranslation } from "react-i18next";

const useStyles = makeStyles((theme) =>
  createStyles({
    code: {
      whiteSpace: "pre-wrap",
      overflow: "auto",
    },
    card: {
      marginBottom: theme.spacing(1),
      marginTop: theme.spacing(1),
      fontSize: "larger",
    },
  })
);

export const Dashboard: FunctionComponent = () => {
  const auth = useAuth();
  const kratos = useKratos();
  const [userSession, setUserSession] = useState<Session>();
  const classes = useStyles();
  const { t } = useTranslation();

  useEffect(() => {
    kratos.whoami().then((b) => setUserSession(b));
  });

  return (
    <>
      <Card className={classes.card}>
        <CardHeader title={t("USER_DATA")} />
        <CardContent>
          <pre className={classes.code}>
            <code>{JSON.stringify(auth?.userData, null, 2)}</code>
          </pre>
        </CardContent>
      </Card>

      <Card className={classes.card}>
        <CardHeader title={t("USER_SESSION")} />
        <CardContent>
          <pre className={classes.code}>
            <code>{JSON.stringify(userSession, null, 2)}</code>
          </pre>
        </CardContent>
      </Card>
    </>
  );
};
