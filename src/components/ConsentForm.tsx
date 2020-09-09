import React from "react";
import { FunctionComponent } from "react";
import { BasicForm } from "./BasicFrom";
import { ConsentData } from "../models";
import {
  Button,
  Checkbox,
  CircularProgress,
  Divider,
  FormControl,
  FormControlLabel,
  FormGroup,
  FormLabel,
  Grid,
} from "@material-ui/core";
import { Trans, useTranslation } from "react-i18next";
import { makeStyles } from "@material-ui/core/styles";

const useStyles = makeStyles(() => {
  return {
    hidden: {
      display: "none",
    },
  };
});

type Props = {
  data?: ConsentData;
};

export const ConsentForm: FunctionComponent<Props> = ({ data }: Props) => {
  const { t } = useTranslation();
  const classes = useStyles();

  const render = () => {
    if (!data) {
      return <CircularProgress />;
    } else {
      return (
        <>
          <Grid container direction="column">
            <input
              className={classes.hidden}
              readOnly
              type="text"
              value={data.challenge}
              name="challenge"
            />

            <FormControl component="fieldset">
              <FormLabel component="legend">
                <Trans i18nKey="CONSENT_HINT">
                  Client [{data.client.clientName}] is asking for the following
                  permissions:
                </Trans>
              </FormLabel>
              <FormGroup>
                {data.requested_scope.map((s) => (
                  <ScopeCheckbox key={s} scope={s} />
                ))}
              </FormGroup>
            </FormControl>

            <Divider />

            {data.client.policyUri && (
              <div>
                <a href={data.client.policyUri}>{t("POLICY_HINT")}</a>
              </div>
            )}
            {data.client.tosUri && (
              <div>
                <a href={data.client.tosUri}>{t("TOS_HINT")}</a>
              </div>
            )}

            <FormControlLabel
              control={<Checkbox name="remember" value="true" />}
              label={t("REMEMBER_HINT")}
            />
          </Grid>
        </>
      );
    }
  };

  return (
    <BasicForm
      title={t("CONSENT_ACK")}
      actionURL={`${process.env.REACT_APP_BACKEND_URL}/post-consent`}
      submitLabel={t("SUBMIT")}
      alterActions={
        <Button type="submit" name="submit" value="false">
          {t("DENY")}
        </Button>
      }
    >
      {render()}
    </BasicForm>
  );
};

interface ScopeCheckboxProps {
  scope: string;
}

const ScopeCheckbox: FunctionComponent<ScopeCheckboxProps> = ({
  scope,
}: ScopeCheckboxProps) => {
  const classes = useStyles();

  const render = () => {
    if (scope.indexOf(":") !== -1) {
      return (
        <FormControlLabel
          key={scope}
          control={<Checkbox checked name="scopes" value={scope} />}
          label={scope}
        />
      );
    } else {
      return (
        <Checkbox
          className={classes.hidden}
          checked
          name="scopes"
          value={scope}
        />
      );
    }
  };

  return render();
};
