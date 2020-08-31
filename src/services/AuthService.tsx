import React, { createContext, FunctionComponent, useContext } from "react";
import { useHistory } from "react-router-dom";
import H from "history";

const LS_AUTHED = "kratos.authed";
const LS_REFERER = "kratos.referer";

interface AuthService {
  setReferer(referer?: string): void;

  getReferer(): string | null;

  setAuthed(isAuthed: boolean): void;

  getAuthed(): boolean;

  login(setReferer: boolean): void;

  register(setReferer: boolean): void;

  logout(): void;

  refresh(): void;
}

class AuthServiceImpl implements AuthService {
  constructor(private history: H.History<unknown>) {}

  getAuthed(): boolean {
    return localStorage.getItem(LS_AUTHED) === "true";
  }

  getReferer(): string | null {
    return localStorage.getItem(LS_REFERER);
  }

  login(setReferer: boolean): void {
    console.log("Auth: login, setReferer: ", setReferer);
    if (setReferer) {
      this.setReferer(window.location.toString());
    }
    this.history.push("/auth/login");
  }

  logout(): void {
    console.log("Auth: logout");
    this.setReferer(undefined);
    window.location.assign(
      `${process.env.REACT_APP_KRATOS_PUBLIC_URL}/self-service/browser/flows/logout`
    );
  }

  refresh(): void {
    console.log("Auth: refresh");
    this.setAuthed(false);
    window.location.assign(
      `${process.env.REACT_APP_KRATOS_PUBLIC_URL}/self-service/browser/flows/login?refresh=true&return_to=${process.env.REACT_APP_BASE_URL}/callback`
    );
  }

  register(setReferer: boolean): void {
    console.log("Auth: register, setReferer: ", setReferer);
    if (setReferer) {
      this.setReferer(window.location.toString());
    }
    this.history.push("/auth/registration");
  }

  setAuthed(isAuthed: boolean): void {
    if (isAuthed) {
      localStorage.setItem(LS_AUTHED, "true");
    } else {
      localStorage.removeItem(LS_AUTHED);
    }
  }

  setReferer(referer?: string): void {
    if (referer) {
      localStorage.setItem(LS_REFERER, referer);
    } else {
      localStorage.removeItem(LS_REFERER);
    }
  }
}

const AuthContext = createContext<AuthService | null>(null);

export const AuthProvider: FunctionComponent = (props) => {
  const history = useHistory();
  const service: AuthService = new AuthServiceImpl(history);

  return (
    <AuthContext.Provider value={service}>
      {props.children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthService => {
  const service = useContext(AuthContext);
  if (!service) {
    throw Error("Please initialize `AuthProvider` before `useAuth`");
  }
  return service;
};
