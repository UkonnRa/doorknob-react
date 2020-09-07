import React, { FunctionComponent } from "react";
import { FormField, Message } from "@oryd/kratos-client";
import { KratosMessages } from "./index";
import { FORM_LABELS } from "../constants/kratos";
import { Button, Grid, TextField } from "@material-ui/core";
import { useTranslation } from "react-i18next";
import { makeStyles } from "@material-ui/core/styles";

interface Props {
  action: string;
  messages?: Message[];
  fields: FormField[];
  submitLabel?: string;
}

const useStyles = makeStyles((theme) => {
  return {
    root: {
      width: "90%",
    },
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
  const { action, messages = [], fields, submitLabel } = props;
  const fieldsSorted = sortFormFields({ fields });
  const classes = useStyles();

  return (
    <>
      {!!messages?.length && <KratosMessages messages={messages} />}
      {action && (
        <form className={classes.root} action={action} method="POST">
          {renderFormFields({ fields: fieldsSorted })}
          {submitLabel && <Button type="submit">{submitLabel}</Button>}
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
    const { t } = useTranslation();
    const { name, type, required, value, messages = [] } = field;
    const label = FORM_LABELS[name]?.label;
    const classes = useStyles();
    return (
      <div key={name}>
        <TextField
          className={`${classes.field} ${type === "hidden" && classes.hidden}`}
          type={type}
          name={name}
          defaultValue={value?.toString()}
          required={required}
          label={t(label)}
        />
        <KratosMessages messages={messages} />
      </div>
    );
  });
