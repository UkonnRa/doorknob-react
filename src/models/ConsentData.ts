import { OAuth2Client } from "@ory/hydra-client";

export interface ConsentData {
  challenge: string;
  requested_scope: string[];
  user: string;
  client: OAuth2Client;
}
