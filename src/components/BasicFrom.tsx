import React, { FunctionComponent, HTMLAttributes, ReactNode } from "react";
import { I18nMenu } from "./index";
import {
  Button,
  Card,
  CardActions,
  CardContent,
  CardHeader,
  Grid,
  IconButton,
} from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import TranslateIcon from "@material-ui/icons/Translate";
import BrightnessMediumIcon from "@material-ui/icons/BrightnessMedium";
import { useThemeChanger } from "../services";

export interface BasicFormProps extends HTMLAttributes<unknown> {
  title: string;
  titleMenu?: ReactNode;

  actionURL: string;

  submitLabel: string;
  alterActions?: ReactNode;
}

const useStyles = makeStyles(() => {
  return {
    root: {
      width: "90%",
    },
    mainAction: {
      flex: "auto",
    },
  };
});

export const BasicForm: FunctionComponent<BasicFormProps> = ({
  title,
  titleMenu,
  actionURL,
  children,

  submitLabel,
  alterActions,
  className,
}: BasicFormProps) => {
  const classes = useStyles();
  const themeChanger = useThemeChanger();
  const [anchorEl, setAnchorEl] = React.useState<HTMLElement>();

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
              {children}
            </Grid>
          </CardContent>
          <CardActions>
            <div className={classes.mainAction}>
              <Button type="submit" name="submit" value="true">
                {submitLabel}
              </Button>
            </div>
            {alterActions}
          </CardActions>
        </form>
      </Grid>
    </Card>
  );
};
