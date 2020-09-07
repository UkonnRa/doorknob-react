import React, { useEffect, useState } from "react";
import { FunctionComponent } from "react";
import qs from "query-string";
import { useLocation } from "react-router-dom";
import { VerificationRequest } from "@oryd/kratos-client";
import { useKratos, useLogger } from "../services";
import { KratosForm, KratosMessages } from "../components";

export const Verification: FunctionComponent = () => {
  const [body, setBody] = useState<VerificationRequest>();
  const location = useLocation();
  const { request } = qs.parse(location.search);
  const kratos = useKratos();
  const logger = useLogger();

  useEffect(() => {
    kratos
      .initVerify(request)
      .then((b) => {
        if (b) {
          console.log("Body: ", b);
          setBody(b);
        }
      })
      .catch((err) => logger.error("Error: ", err));
  }, [kratos, logger, request]);

  const messages = body?.messages;
  const form = body?.form;

  return (
    <>
      {messages && <KratosMessages messages={messages} />}
      {form && (
        <KratosForm
          submitLabel="Verify"
          actionURL={form.action}
          fields={form.fields}
          messages={form.messages}
          title={"User Verification"}
        />
      )}
    </>
  );
};
