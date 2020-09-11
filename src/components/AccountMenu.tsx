import React, { Dispatch, FunctionComponent, SetStateAction } from "react";
import {
  createStyles,
  Divider,
  ListItemIcon,
  ListItemText,
  Menu,
  MenuItem,
  Theme,
} from "@material-ui/core";
import { useTranslation } from "react-i18next";
import { useAuth } from "oidc-react";
import { makeStyles } from "@material-ui/core/styles";
import ExitToAppIcon from "@material-ui/icons/ExitToApp";
import SettingsIcon from "@material-ui/icons/Settings";

interface Props {
  anchorEl?: HTMLElement;
  setAnchorEl: Dispatch<SetStateAction<HTMLElement | undefined>>;
}

const useStyles = makeStyles((theme: Theme) => createStyles({}));

export const AccountMenu: FunctionComponent<Props> = ({
  anchorEl,
  setAnchorEl,
}: Props) => {
  const { t } = useTranslation();
  const auth = useAuth();

  return (
    <Menu
      anchorEl={anchorEl}
      keepMounted
      open={Boolean(anchorEl)}
      onClose={() => setAnchorEl(undefined)}
    >
      <MenuItem onClick={() => window.location.assign("/settings")}>
        <ListItemIcon>
          <SettingsIcon />
        </ListItemIcon>
        <ListItemText primary={t("SETTINGS")} />
      </MenuItem>
      <Divider />
      <MenuItem onClick={() => auth?.signOutRedirect()}>
        <ListItemIcon>
          <ExitToAppIcon />
        </ListItemIcon>
        <ListItemText primary={t("LOGOUT")} />
      </MenuItem>
    </Menu>
  );
};
