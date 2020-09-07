import React, { FunctionComponent } from "react";
import { Message } from "@oryd/kratos-client";
import { Typography } from "@material-ui/core";

interface Props {
  messages: Message[];
}

export const KratosMessages: FunctionComponent<Props> = ({
  messages,
}: Props) => {
  console.log("messages: ", messages);
  return (
    <div className="messages">
      {messages.map(({ text, id }) => (
        <Typography key={id} color="error">
          {text}
        </Typography>
      ))}
    </div>
  );
};
