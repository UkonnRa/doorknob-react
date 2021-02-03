import React, { useEffect, useState } from "react";
import { FunctionComponent } from "react";
import qs from "query-string";
import { useLocation } from "react-router-dom";
import { RegistrationFlow } from "@ory/kratos-client";
import { useKratos, useLogger } from "../services";
import { KratosForm, KratosMessages } from "../components";
import { makeStyles } from "@material-ui/core/styles";
import { Link } from "@material-ui/core";
import { Trans, useTranslation } from "react-i18next";

const useStyles = makeStyles((theme) => {
  return {
    root: {
      [theme.breakpoints.down("sm")]: {
        width: "90%",
      },
      [theme.breakpoints.up("md")]: {
        width: "65%",
      },
      [theme.breakpoints.up("lg")]: {
        width: "40%",
      },
    },
  };
});

export const Registration: FunctionComponent = () => {
  const [body, setBody] = useState<RegistrationFlow>();
  const location = useLocation();
  const { flow } = qs.parse(location.search);
  const kratos = useKratos();
  const logger = useLogger();
  const classes = useStyles();
  const { t } = useTranslation();

  useEffect(() => {
    kratos
      .initRegister(flow)
      .then((b) => {
        if (b) {
          setBody(b);
        }
      })
      .catch((err) => logger.error("Error: ", err));
  }, [kratos, logger, flow]);

  const messages = body?.messages;
  const form = body?.methods?.password?.config;

  return (
    <>
      {messages && <KratosMessages messages={messages} />}
      {form && (
        <KratosForm
          className={classes.root}
          submitLabel={t("REGISTER")}
          actionURL={form.action}
          fields={form.fields}
          messages={form.messages}
          title={t("REGISTER_TITLE")}
          alterActions={
            <Trans i18nKey="REGISTER_ACTIONS.OR_LOGIN">
              Already have a account? <Link href="/login">Log in</Link>
            </Trans>
          }
        />
      )}
    </>
  );
};
