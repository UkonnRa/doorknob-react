import React, {
  createContext,
  Dispatch,
  FunctionComponent,
  Reducer,
  useContext,
  useReducer,
} from "react";
import { useHistory } from "react-router-dom";
import H from "history";

interface AuthService {
  dispatch: React.Dispatch<AuthAction>;
  state: AuthState;
  login(setReferer: boolean): void;
  register(setReferer: boolean): void;
  logout(): void;
  refresh(): void;
}

interface AuthState {
  readonly isAuthenticated: boolean;
  readonly referer?: string;
}

type AuthAction = {
  readonly type: AuthActionType;
};

type AuthActionType =
  | "SET_REFERER"
  | "UNSET_REFERER"
  | "SET_AUTH"
  | "UNSET_AUTH";

const initialState: AuthState = {
  isAuthenticated: false,
  referer: undefined,
};

const reducer: Reducer<AuthState, AuthAction> = (state, action) => {
  switch (action.type) {
    case "SET_REFERER":
      console.log("Set referer to: ", window.location);
      return { ...state, referer: window.location.toString() };
    case "UNSET_REFERER":
      console.log("Unset referer");
      return { ...state, referer: undefined };
    case "SET_AUTH":
      console.log("Set auth");
      return { ...state, isAuthenticated: true };
    case "UNSET_AUTH":
      console.log("Unset auth");
      return { ...state, isAuthenticated: false };
  }
};

const AuthContext = createContext<AuthService | null>(null);
export const AuthProvider: FunctionComponent = (props) => {
  const [state, dispatch] = useReducer(reducer, initialState);
  const history = useHistory();

  const value: AuthService = {
    dispatch,
    state,
    login: (setReferer: boolean) => login(setReferer, dispatch, history),
    register: (setReferer: boolean) => register(setReferer, dispatch, history),
    logout: () => logout(dispatch),
    refresh: () => refresh(dispatch),
  };
  return (
    <AuthContext.Provider value={value}>{props.children}</AuthContext.Provider>
  );
};

export const useAuth = (): AuthService => {
  const service = useContext(AuthContext);
  if (!service) {
    throw Error("Please initialize `AuthProvider` before `useAuth`");
  }
  return service;
};

const login = (
  setReferer: boolean,
  dispatch: React.Dispatch<AuthAction>,
  history: H.History<unknown>
): void => {
  console.log("Auth: login, setReferer: ", setReferer);
  if (setReferer) {
    dispatch({ type: "SET_REFERER" });
  }
  history.push("/auth/login");
};

const register = (
  setReferer: boolean,
  dispatch: React.Dispatch<AuthAction>,
  history: H.History<unknown>
): void => {
  console.log("Auth: register, setReferer: ", setReferer);
  if (setReferer) {
    dispatch({ type: "SET_REFERER" });
  }
  history.push("/auth/registration");
};

const logout = (dispatch: React.Dispatch<AuthAction>): void => {
  console.log("Auth: logout");
  dispatch({ type: "UNSET_AUTH" });
  window.location.assign(
    `${process.env.REACT_APP_KRATOS_PUBLIC_URL}/self-service/browser/flows/logout`
  );
};

const refresh = (dispatch: React.Dispatch<AuthAction>): void => {
  console.log("Auth: refresh");
  dispatch({ type: "UNSET_AUTH" });
  window.location.assign(
    `${process.env.REACT_APP_KRATOS_PUBLIC_URL}/self-service/browser/flows/login?refresh=true&return_to=${process.env.REACT_APP_BASE_URL}/callback`
  );
};
