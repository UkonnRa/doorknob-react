import { OAuth2Client } from "@oryd/hydra-client";

export interface ConsentData {
  challenge: string;
  requested_scope: string[];
  user: string;
  client: OAuth2Client;
}
