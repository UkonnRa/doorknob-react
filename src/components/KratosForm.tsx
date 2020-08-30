import React, { FunctionComponent } from "react";
import { FormField, Message } from "@oryd/kratos-client";
import { KratosMessages } from "./index";
import { FORM_LABELS } from "../constants/kratos";

interface Props {
  action: string;
  messages?: Message[];
  fields: FormField[];
  submitLabel: string;
}

export const KratosForm: FunctionComponent<Props> = (props: Props) => {
  const { action, messages = [], fields, submitLabel = "Submit" } = props;
  const fieldsSorted = sortFormFields({ fields });
  return (
    <>
      {!!messages?.length && <KratosMessages messages={messages} />}
      {action && (
        <form action={action} style={{ margin: "60px 0" }} method="POST">
          {renderFormFields({ fields: fieldsSorted })}
          <button type="submit">{submitLabel}</button>
        </form>
      )}
    </>
  );
};

const sortFormFields = ({ fields }: { fields: FormField[] }) => {
  return fields.sort((current, next) => {
    const c = FORM_LABELS[current.name]?.priority || 0;
    const n = FORM_LABELS[next.name]?.priority || 0;
    return n - c;
  });
};

const renderFormFields = ({ fields = [] }: { fields: FormField[] }) =>
  fields.map((field) => {
    const { name, type, required, value, messages = [] } = field;
    const _required = required ? { required } : {};
    const _label = FORM_LABELS[name]?.label;
    const style = type === "hidden" ? { display: "none" } : {};
    return (
      <fieldset key={name} style={style}>
        <label>
          <input
            type={type}
            name={name}
            defaultValue={value?.toString()}
            {..._required}
          />
          {_label && <span>{_label}</span>}
        </label>
        <KratosMessages messages={messages} />
      </fieldset>
    );
  });
