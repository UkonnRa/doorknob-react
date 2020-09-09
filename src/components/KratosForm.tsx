import React, { FunctionComponent, HTMLAttributes } from "react";
import { FormField, Message } from "@oryd/kratos-client";
import { KratosMessages } from "./index";
import { FORM_LABELS } from "../constants/kratos";
import { TextField } from "@material-ui/core";
import { useTranslation } from "react-i18next";
import { makeStyles } from "@material-ui/core/styles";
import { BasicForm, BasicFormProps } from "./BasicFrom";

interface Props extends HTMLAttributes<unknown>, BasicFormProps {
  title: string;
  fields: FormField[];
  messages?: Message[];
}

const useStyles = makeStyles((theme) => {
  return {
    field: {
      width: "100%",
      paddingBottom: theme.spacing(1),
    },
    hidden: {
      display: "none",
    },
  };
});

export const KratosForm: FunctionComponent<Props> = (props: Props) => {
  const fieldsSorted = sortFormFields({ fields: props.fields });

  return (
    <BasicForm {...props}>
      {renderFormFields({ fields: fieldsSorted })}
      {props.messages && <KratosMessages messages={props.messages} />}
    </BasicForm>
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
    const { t } = useTranslation();
    const { name, type, required, value, messages } = field;
    const label = FORM_LABELS[name]?.label;
    const classes = useStyles();
    return (
      <React.Fragment key={name}>
        <TextField
          className={`${classes.field} ${
            type === "hidden" ? classes.hidden : ""
          }`.trim()}
          type={type}
          name={name}
          defaultValue={value?.toString()}
          required={required}
          label={t(label)}
        />
        {messages && <KratosMessages messages={messages} />}
      </React.Fragment>
    );
  });
