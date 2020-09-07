import React, { useEffect, useState } from "react";
import { FunctionComponent } from "react";
import qs from "query-string";
import { useLocation } from "react-router-dom";
import { LoginRequest } from "@oryd/kratos-client";
import { useKratos, useSnack, useThemeChanger } from "../services";
import { KratosForm, KratosMessages } from "../components";
import { useTranslation } from "react-i18next";
import {
  Card,
  CardActionArea,
  CardActions,
  CardContent,
  CardHeader,
  createMuiTheme,
  Grid,
  IconButton,
  Menu,
  MenuItem,
  PaletteType,
  Theme,
} from "@material-ui/core";
import MoreVertIcon from "@material-ui/icons/MoreVert";
import InvertColorsIcon from "@material-ui/icons/InvertColors";
import { makeStyles } from "@material-ui/core/styles";

const useStyles = makeStyles((theme) => {
  return {
    root: {
      [theme.breakpoints.down("sm")]: {
        width: "90%",
      },
      [theme.breakpoints.up("md")]: {
        width: "65%",
      },
      [theme.breakpoints.up("lg")]: {
        width: "40%",
      },
    },
  };
});

export const Login: FunctionComponent = () => {
  const snack = useSnack();
  const [body, setBody] = useState<LoginRequest>();
  const location = useLocation();
  const { request } = qs.parse(location.search);
  const kratos = useKratos();
  const { t, i18n } = useTranslation();
  const themeChanger = useThemeChanger();
  const classes = useStyles();

  useEffect(() => {
    kratos
      .initLogin(request)
      .then((b) => b && setBody(b))
      .catch(() => {
        snack.createSnack(t("INIT_LOGIN_FAILED"));
        window.location.assign("/login");
      });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [kratos, request]);

  const messages = body?.messages;
  const form = body?.methods?.password?.config;

  const [anchorEl, setAnchorEl] = React.useState<HTMLElement | undefined>(
    undefined
  );

  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const onZhHans = () =>
    i18n.changeLanguage("zh-Hans").then(() => setAnchorEl(undefined));

  const onEn = () =>
    i18n.changeLanguage("en").then(() => setAnchorEl(undefined));

  return (
    <>
      <Card className={classes.root}>
        <CardHeader
          title={t("PROJECT_TITLE")}
          action={
            <>
              <IconButton color="primary" onClick={handleClick}>
                <MoreVertIcon />
              </IconButton>
              <IconButton
                color="secondary"
                onClick={() => {
                  themeChanger.changeTheme(
                    themeChanger.themeType === "light" ? "dark" : "light"
                  );
                }}
              >
                <InvertColorsIcon />
              </IconButton>
            </>
          }
        />
        <CardContent>
          <Grid
            container
            direction="column"
            justify="center"
            alignItems="center"
          >
            {messages && <KratosMessages messages={messages} />}
            {form && (
              <KratosForm
                submitLabel={t("LOGIN_SUBMIT")}
                action={form.action}
                fields={form.fields}
                messages={form.messages}
              />
            )}
          </Grid>
        </CardContent>
        <CardActions>
          <div>
            Or <a href="/registration">register</a>
          </div>
        </CardActions>
      </Card>
      <Menu
        anchorEl={anchorEl}
        keepMounted
        open={Boolean(anchorEl)}
        onClose={() => setAnchorEl(undefined)}
      >
        <MenuItem onClick={onZhHans}>中文</MenuItem>
        <MenuItem onClick={onEn}>English</MenuItem>
      </Menu>
    </>
  );
};
