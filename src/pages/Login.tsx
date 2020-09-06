import React, { useEffect, useState } from "react";
import { FunctionComponent } from "react";
import qs from "query-string";
import { useLocation } from "react-router-dom";
import { LoginRequest } from "@oryd/kratos-client";
import { useKratos, useLogger, useSnack } from "../services";
import { KratosForm, KratosMessages } from "../components";
import { useTranslation } from "react-i18next";
import { Button, Menu, MenuItem } from "@material-ui/core";

export const Login: FunctionComponent = () => {
  const snack = useSnack();
  const [body, setBody] = useState<LoginRequest>();
  const location = useLocation();
  const { request } = qs.parse(location.search);
  const kratos = useKratos();
  const logger = useLogger();
  const { t, i18n } = useTranslation();

  useEffect(() => {
    kratos
      .initLogin(request)
      .then((b) => {
        if (b) {
          snack.createSnack(JSON.stringify(b).substring(0, 10));
          setBody(b);
        }
      })
      .catch(() => {
        snack.createSnack(t("INIT_LOGIN_FAILED"));
        window.location.assign("/login");
      });
  }, [kratos, logger, request, snack, t]);

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
      <Button onClick={handleClick}>{t("CHANGE_LANGUAGE")}</Button>
      <Menu
        anchorEl={anchorEl}
        keepMounted
        open={Boolean(anchorEl)}
        onClose={() => setAnchorEl(undefined)}
      >
        <MenuItem onClick={onZhHans}>中文</MenuItem>
        <MenuItem onClick={onEn}>English</MenuItem>
      </Menu>
      {messages && <KratosMessages messages={messages} />}
      {form && (
        <KratosForm
          submitLabel={t("LOGIN_SUBMIT")}
          action={form.action}
          fields={form.fields}
          messages={form.messages}
        />
      )}
    </>
  );
};
