import React, { useEffect, useState } from "react";
import { FunctionComponent } from "react";
import qs from "query-string";
import { useLocation } from "react-router-dom";
import { RegistrationRequest } from "@oryd/kratos-client";
import { useKratos, useLogger } from "../services";
import { KratosForm, KratosMessages } from "../components";
import { makeStyles } from "@material-ui/core/styles";
import { Link } from "@material-ui/core";

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
  const [body, setBody] = useState<RegistrationRequest>();
  const location = useLocation();
  const { request } = qs.parse(location.search);
  const kratos = useKratos();
  const logger = useLogger();
  const classes = useStyles();

  useEffect(() => {
    kratos
      .initRegister(request)
      .then((b) => {
        if (b) {
          setBody(b);
        }
      })
      .catch((err) => logger.error("Error: ", err));
  }, [kratos, logger, request]);

  const messages = body?.messages;
  const form = body?.methods?.password?.config;

  return (
    <>
      {messages && <KratosMessages messages={messages} />}
      {form && (
        <KratosForm
          className={classes.root}
          submitLabel="Register"
          actionURL={form.action}
          fields={form.fields}
          messages={form.messages}
          title={"User Registration"}
          alterActions={
            <div>
              Already have a account? <Link href="/login">Log in</Link>
            </div>
          }
        />
      )}
    </>
  );
};
