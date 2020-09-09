import React from "react";
import { FunctionComponent } from "react";
import { BasicForm } from "./BasicFrom";
import { ConsentData } from "../models";
import {
  Button,
  Checkbox,
  CircularProgress,
  FormControl,
  FormControlLabel,
  FormGroup,
  FormLabel,
} from "@material-ui/core";
import { Trans } from "react-i18next";

type Props = {
  data?: ConsentData;
};

export const ConsentForm: FunctionComponent<Props> = ({ data }: Props) => {
  const render = () => {
    if (!data) {
      return <CircularProgress />;
    } else {
      return (
        <>
          <input
            readOnly
            type="text"
            hidden={true}
            value={data.challenge}
            name="challenge"
          />

          <FormControl component="fieldset">
            <FormLabel component="legend">
              <Trans>
                Client [{data.client.clientName}] is asking for the following
                permissions:
              </Trans>
            </FormLabel>
            <FormGroup>
              {data.requested_scope.map((s) => (
                <FormControlLabel
                  key={s}
                  control={<Checkbox checked name="scopes" value={s} />}
                  label={s}
                />
              ))}
            </FormGroup>
          </FormControl>

          {data.client.policyUri && (
            <div>
              <a href={data.client.policyUri}>Read the Privacy Policy</a>
            </div>
          )}
          {data.client.tosUri && (
            <div>
              <a href={data.client.tosUri}>Terms of Service</a>
            </div>
          )}

          <FormControlLabel
            control={<Checkbox name="remember" value="true" />}
            label="Do not ask me again"
          />
        </>
      );
    }
  };

  return (
    <BasicForm
      title="Consent Acknowledge"
      actionURL={`${process.env.REACT_APP_BACKEND_URL}/post-consent`}
      submitLabel={"Submit"}
      alterActions={
        <Button type="submit" name="submit" value="false">
          Deny
        </Button>
      }
    >
      {render()}
    </BasicForm>
  );
};
