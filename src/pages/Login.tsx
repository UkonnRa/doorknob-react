import React, { useEffect, useState } from "react";
import { FunctionComponent } from "react";
import qs from "query-string";
import { useLocation } from "react-router-dom";
import { LoginRequest } from "@oryd/kratos-client";
import { useKratos, useSnack } from "../services";
import { KratosForm } from "../components";
import { useTranslation } from "react-i18next";
import { Link } from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";

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

export const Login: FunctionComponent = () => {
  const snack = useSnack();
  const [body, setBody] = useState<LoginRequest>();
  const location = useLocation();
  const { request } = qs.parse(location.search);
  const kratos = useKratos();
  const { t } = useTranslation();
  const classes = useStyles();

  useEffect(() => {
    kratos
      .initLogin(request)
      .then((b) => b && setBody(b))
      .catch(() => {
        snack.createSnack(t("INIT_LOGIN_FAILED"));
        window.location.assign("/login");
      });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const form = body?.methods?.password?.config;

  return (
    <>
      {form && (
        <KratosForm
          className={classes.root}
          title={t("PROJECT_TITLE")}
          fields={form.fields}
          messages={form.messages}
          actionURL={form.action}
          submitLabel={t("LOGIN_SUBMIT")}
          alterActions={
            <div>
              Or <Link href="/registration">register</Link>
            </div>
          }
        />
      )}
    </>
  );
};
