import React, { useEffect, useState } from "react";
import { FunctionComponent } from "react";
import qs from "query-string";
import { useLocation, useHistory } from "react-router-dom";

export const Login: FunctionComponent = () => {
  const location = useLocation();
  const history = useHistory();
  const { request } = qs.parse(location.search);
  const [requestContent, setRequestContent] = useState<unknown>(null);

  useEffect(() => {
    if (request) {
      getRequest();
    }
  }, [request]);

  const startRegister = async () => {
    const resp = await fetch(
      `${process.env.REACT_APP_DOORKNOB_KRATOS_ENDPOINT}/.ory/login`
    );
    const body: { url: string } = await resp.json();
    window.location.assign(body.url);
  };

  const getRequest = async () => {
    const url = qs.stringifyUrl({
      url: `${process.env.REACT_APP_DOORKNOB_KRATOS_ENDPOINT}/login`,
      query: { request },
    });
    const resp = await fetch(url);
    if (!resp.ok) {
      history.push("/login");
    } else {
      const body = await resp.json();
      setRequestContent(body);
    }
  };

  const body = () => {
    if (!request) {
      return <button onClick={startRegister}>Login!</button>;
    } else {
      return (
        <div>
          <div>
            <button onClick={getRequest}>Load Request</button>
          </div>
          Request Id: {request}
          {requestContent ? (
            <div>{JSON.stringify(requestContent, null, 2)}</div>
          ) : (
            <div>Loading...</div>
          )}
        </div>
      );
    }
  };

  return body();
};
