import React, { useCallback, useEffect, useState } from "react";
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

  const init = useCallback(async (): Promise<void> => {
    const b = await kratos.initLogin(request);
    console.log("Login body: ", b);
    if (b) {
      setBody(b);
    }
  }, [kratos, request]);

  useEffect(() => {
    console.log("init Login");
    init().catch((err) => console.error("Error: ", err));
  }, [init]);

  console.log("Login Component: body: ", body);
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
