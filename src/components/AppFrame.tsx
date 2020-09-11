import React, { FunctionComponent, PropsWithChildren } from "react";
import {
  AppBar,
  createStyles,
  Grid,
  IconButton,
  Theme,
  Toolbar,
  Typography,
} from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import TranslateIcon from "@material-ui/icons/Translate";
import BrightnessMediumIcon from "@material-ui/icons/BrightnessMedium";
import AccountCircleIcon from "@material-ui/icons/AccountCircle";
import { I18nMenu } from "./I18nMenu";
import { useThemeChanger } from "../services";
import { AccountMenu } from "./AccountMenu";

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      [theme.breakpoints.down("md")]: {
        width: "95%",
      },
      [theme.breakpoints.up("lg")]: {
        width: "80%",
      },
    },

    title: {
      cursor: "pointer",
      "&:hover": {
        textDecoration: "underline",
      },
    },

    grow: {
      flexGrow: 1,
    },
  })
);

export const AppFrame: FunctionComponent = ({
  children,
}: PropsWithChildren<unknown>) => {
  const classes = useStyles();
  const [langEl, setLangEl] = React.useState<HTMLElement>();
  const [settingsEl, setSettingsEl] = React.useState<HTMLElement>();
  const themeChanger = useThemeChanger();

  return (
    <>
      <AppBar position="sticky">
        <Toolbar>
          <Typography
            className={classes.title}
            variant="h6"
            onClick={() => window.location.assign("/")}
          >
            DoorKnob
          </Typography>

          <div className={classes.grow} />
          <IconButton
            color="inherit"
            onClick={(event) => setLangEl(event.currentTarget)}
          >
            <TranslateIcon />
          </IconButton>
          <IconButton
            color="inherit"
            onClick={() => {
              themeChanger.changeTheme(
                themeChanger.themeType === "light" ? "dark" : "light"
              );
            }}
          >
            <BrightnessMediumIcon />
          </IconButton>
          <I18nMenu setAnchorEl={setLangEl} anchorEl={langEl} />
          <IconButton
            color="inherit"
            onClick={(event) => setSettingsEl(event.currentTarget)}
          >
            <AccountCircleIcon />
          </IconButton>
          <AccountMenu setAnchorEl={setSettingsEl} anchorEl={settingsEl} />
        </Toolbar>
      </AppBar>

      <Grid container justify="center">
        <div className={classes.root}>{children}</div>
      </Grid>
    </>
  );
};
