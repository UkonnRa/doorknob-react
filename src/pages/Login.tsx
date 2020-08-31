import React, { useEffect, useState } from "react";
import { FunctionComponent } from "react";
import qs from "query-string";
import { useLocation } from "react-router-dom";
import { LoginRequest } from "@oryd/kratos-client";
import { useKratos } from "../services";
import { KratosForm, KratosMessages } from "../components";

export const Login: FunctionComponent = () => {
  const [body, setBody] = useState<LoginRequest>();
  const location = useLocation();
  const { request } = qs.parse(location.search);
  const kratos = useKratos();

  useEffect(() => {
    kratos
      .initLogin(request)
      .then((b) => {
        if (b) {
          setBody(b);
        }
      })
      .catch((err) => console.error("Error: ", err));
  }, [kratos, request]);

  const messages = body?.messages;
  const form = body?.methods?.password?.config;

  return (
    <>
      {messages && <KratosMessages messages={messages} />}
      {form && (
        <KratosForm
          submitLabel="Log in"
          action={form.action}
          fields={form.fields}
          messages={form.messages}
        />
      )}
    </>
  );
};
