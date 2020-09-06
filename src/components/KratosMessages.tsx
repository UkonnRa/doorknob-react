import React, { FunctionComponent } from "react";
import { Message } from "@oryd/kratos-client";

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
        <div key={id}>{text}</div>
      ))}
    </div>
  );
};
