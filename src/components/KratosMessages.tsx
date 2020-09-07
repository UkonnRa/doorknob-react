import React, { FunctionComponent } from "react";
import { Message } from "@oryd/kratos-client";
import { Typography } from "@material-ui/core";

interface Props {
  messages: Message[];
}

export const KratosMessages: FunctionComponent<Props> = ({
  messages,
}: Props) => {
  return (
    <div>
      {messages.map(({ text, id, type }) => (
        <Typography key={id} color={type === "error" ? "error" : "primary"}>
          {text}
        </Typography>
      ))}
    </div>
  );
};
