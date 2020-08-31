import React, { useEffect, useState } from "react";
import { FunctionComponent } from "react";
import qs from "query-string";
import { useLocation } from "react-router-dom";
import { RegistrationRequest } from "@oryd/kratos-client";
import { useKratos } from "../services";
import { KratosForm, KratosMessages } from "../components";

export const Registration: FunctionComponent = () => {
  const [body, setBody] = useState<RegistrationRequest>();
  const location = useLocation();
  const { request } = qs.parse(location.search);
  const kratos = useKratos();

  useEffect(() => {
    kratos
      .initRegister(request)
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
          submitLabel="Register"
          action={form.action}
          fields={form.fields}
          messages={form.messages}
        />
      )}
    </>
  );
};
