import React, { Dispatch, FunctionComponent, SetStateAction } from "react";
import { Menu, MenuItem } from "@material-ui/core";
import { useTranslation } from "react-i18next";

interface Props {
  anchorEl?: HTMLElement;
  setAnchorEl: Dispatch<SetStateAction<HTMLElement | undefined>>;
}

export const I18nMenu: FunctionComponent<Props> = ({
  anchorEl,
  setAnchorEl,
}: Props) => {
  const { i18n } = useTranslation();

  const onLangChanged = (lang: string) =>
    i18n.changeLanguage(lang).then(() => setAnchorEl(undefined));

  return (
    <Menu
      anchorEl={anchorEl}
      keepMounted
      open={Boolean(anchorEl)}
      onClose={() => setAnchorEl(undefined)}
    >
      <MenuItem onClick={() => onLangChanged("zh-Hans")}>中文</MenuItem>
      <MenuItem onClick={() => onLangChanged("en")}>English</MenuItem>
    </Menu>
  );
};
