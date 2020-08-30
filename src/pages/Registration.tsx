import React, { useCallback, useEffect, useState } from "react";
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
  const kratosService = useKratos();

  const init = useCallback(async (): Promise<void> => {
    const b = await kratosService.initRegister(request);
    if (b) {
      setBody(b);
    }
  }, [kratosService, request]);

  useEffect(() => {
    init().catch((err) => console.error("Error: ", err));
  }, [init]);

  const messages = body?.messages;
  const form = body?.methods?.password?.config;

  return (
    <>
      {messages && <KratosMessages messages={messages} />}
      {form && (
        <KratosForm
          submitLabel="Sign in"
          action={form.action}
          fields={form.fields}
          messages={form.messages}
        />
      )}
    </>
  );
};
