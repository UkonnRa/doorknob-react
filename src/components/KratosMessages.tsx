import React, { FunctionComponent } from "react";
import { Message } from "@oryd/kratos-client";

interface Props {
  messages: Message[];
}

export const KratosMessages: FunctionComponent<Props> = ({
  messages,
}: Props) => (
  <div className="messages">
    {messages.map(({ text, id, type }) => (
      <div key={id} className={`message ${type}`}>
        {text}
      </div>
    ))}
  </div>
);
