import React, { createContext, FunctionComponent, useContext } from "react";

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

const AuthContext = createContext<AuthService | null>(null);

export const AuthProvider: FunctionComponent = (props) => {
  const setReferer = (referer?: string): void => {
    if (referer) {
      localStorage.setItem(LS_REFERER, referer);
    } else {
      localStorage.removeItem(LS_REFERER);
    }
  };

  const getReferer = (): string | null => {
    return localStorage.getItem(LS_REFERER);
  };

  const setAuthed = (isAuthed: boolean): void => {
    if (isAuthed) {
      localStorage.setItem(LS_AUTHED, "true");
    } else {
      localStorage.removeItem(LS_AUTHED);
    }
  };

  const getAuthed = (): boolean => {
    return localStorage.getItem(LS_AUTHED) === "true";
  };

  const login = (doSetReferer: boolean): void => {
    if (doSetReferer) {
      setReferer(window.location.toString());
    }
    window.location.assign("/auth/login");
  };

  const register = (doSetReferer: boolean): void => {
    if (doSetReferer) {
      setReferer(window.location.toString());
    }
    window.location.assign("/auth/registration");
  };

  const logout = (): void => {
    setReferer(undefined);
    window.location.assign(
      `${process.env.REACT_APP_KRATOS_PUBLIC_URL}/self-service/browser/flows/logout`
    );
  };

  const refresh = (): void => {
    setAuthed(false);
    window.location.assign(
      `${process.env.REACT_APP_KRATOS_PUBLIC_URL}/self-service/browser/flows/login?refresh=true&return_to=${process.env.REACT_APP_BASE_URL}/callback`
    );
  };

  return (
    <AuthContext.Provider
      value={{
        setReferer,
        getReferer,
        setAuthed,
        getAuthed,
        login,
        register,
        logout,
        refresh,
      }}
    >
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
