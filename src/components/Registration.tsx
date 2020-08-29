import React, { useEffect, useState } from "react";
import { FunctionComponent } from "react";
import qs from "query-string";
import { useLocation, useHistory } from "react-router-dom";
import * as kratosClient from "@oryd/kratos-client";

type RegReq = {
  methods: {
    password: {
      config: {
        action?: string,
        fields: {name: string, type: string, value: string}[],
        method: string,
      }
    }
  }
}

export const Registration: FunctionComponent = () => {
  const location = useLocation();
  const history = useHistory();
  const { request } = qs.parse(location.search);
  const [requestContent, setRequestContent] = useState<RegReq | null>(null);

  useEffect(() => {
    if (request) {
      getRequest();
    }
  }, [request]);

  const startRegister = async () => {
    const resp = await fetch(
      `${process.env.REACT_APP_DOORKNOB_KRATOS_ENDPOINT}/.ory/self-service/browser/flows/registration`
    );
    const body: { url: string } = await resp.json();
    window.location.assign(body.url);
  };

  const getRequest = async () => {
    const url = qs.stringifyUrl({
      url: `${process.env.REACT_APP_DOORKNOB_KRATOS_ENDPOINT}/registration`,
      query: { request }
    });
    const resp = await fetch(url);
    if (!resp.ok) {
      history.push("/registration");
    } else {
      const body = await resp.json();
      setRequestContent(body);
    }
  };


  const form = () => {
    console.log('req: ', requestContent);

    const { action, fields, method } = requestContent!!.methods.password.config;
    return <form action={action} method={method}>
      {fields.map((f) => <label>
        { f.type ==="hidden" ? null : <span>{f.name}</span> }
        <input key={f.name} name={f.name} type={f.type} value={f.value} />
      </label>)}
      <button>Submit</button>
    </form>;
  };

  const body = () => {
    if (!request) {
      return <button onClick={startRegister}>Register!</button>;
    } else {
      return (
        <div>
          <div>
            <button onClick={getRequest}>Load Request</button>
          </div>
          Request Id: {request}
          {requestContent ? form() : (
            <div>Loading...</div>
          )}
        </div>
      );
    }
  };

  return body();
};
