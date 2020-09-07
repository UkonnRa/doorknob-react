import React, { FunctionComponent, HTMLAttributes, ReactNode } from "react";
import { FormField, Message } from "@oryd/kratos-client";
import { KratosMessages } from "./index";
import { FORM_LABELS } from "../constants/kratos";
import {
  Button,
  Card,
  CardActions,
  CardContent,
  CardHeader,
  Grid,
  TextField,
} from "@material-ui/core";
import { useTranslation } from "react-i18next";
import { makeStyles } from "@material-ui/core/styles";

interface Props extends HTMLAttributes<unknown> {
  title: string;
  titleMenu?: ReactNode;

  fields: FormField[];
  messages?: Message[];
  actionURL: string;

  submitLabel: string;
  alterActions?: ReactNode;
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

export const KratosForm: FunctionComponent<Props> = ({
  title,
  titleMenu,
  fields,
  messages,
  actionURL,
  submitLabel,
  alterActions,
  className,
}: Props) => {
  const fieldsSorted = sortFormFields({ fields });
  const classes = useStyles();

  return (
    <Card className={className}>
      <CardHeader title={title} action={titleMenu} />
      <Grid container direction="column" alignContent="center">
        <form className={classes.root} action={actionURL} method="POST">
          <CardContent>
            <Grid
              container
              direction="column"
              justify="center"
              alignItems="center"
            >
              {renderFormFields({ fields: fieldsSorted })}
              {messages && <KratosMessages messages={messages} />}
            </Grid>
          </CardContent>
          <CardActions>
            <Button type="submit">{submitLabel}</Button>
            {alterActions}
          </CardActions>
        </form>
      </Grid>
    </Card>
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
      <>
        <TextField
          key={name}
          className={`${classes.field} ${
            type === "hidden" ? classes.hidden : ""
          }`}
          type={type}
          name={name}
          defaultValue={value?.toString()}
          required={required}
          label={t(label)}
        />
        {messages && <KratosMessages messages={messages} />}
      </>
    );
  });
