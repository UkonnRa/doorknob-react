import React, {
  Dispatch,
  FunctionComponent,
  HTMLAttributes,
  ReactNode,
  SetStateAction,
} from "react";
import { FormField, Message } from "@oryd/kratos-client";
import { I18nMenu, KratosMessages } from "./index";
import { FORM_LABELS } from "../constants/kratos";
import {
  Button,
  Card,
  CardActions,
  CardContent,
  CardHeader,
  Grid,
  IconButton,
  TextField,
} from "@material-ui/core";
import { useTranslation } from "react-i18next";
import { makeStyles } from "@material-ui/core/styles";
import TranslateIcon from "@material-ui/icons/Translate";
import BrightnessMediumIcon from "@material-ui/icons/BrightnessMedium";
import { useThemeChanger } from "../services";

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
    mainAction: {
      flex: "auto",
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
  const themeChanger = useThemeChanger();
  const [anchorEl, setAnchorEl] = React.useState<HTMLElement | undefined>(
    undefined
  );

  const titleMenuComp = titleMenu ?? (
    <>
      <IconButton
        color="primary"
        onClick={(event) => setAnchorEl(event.currentTarget)}
      >
        <TranslateIcon />
      </IconButton>
      <IconButton
        color="secondary"
        onClick={() => {
          themeChanger.changeTheme(
            themeChanger.themeType === "light" ? "dark" : "light"
          );
        }}
      >
        <BrightnessMediumIcon />
      </IconButton>
      <I18nMenu setAnchorEl={setAnchorEl} anchorEl={anchorEl} />
    </>
  );

  return (
    <Card className={className}>
      <CardHeader title={title} action={titleMenuComp} />
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
            <div className={classes.mainAction}>
              <Button type="submit">{submitLabel}</Button>
            </div>
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
