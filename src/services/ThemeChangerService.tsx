import { createMuiTheme, PaletteType, ThemeProvider } from "@material-ui/core";
import React, {
  createContext,
  FunctionComponent,
  useContext,
  useState,
} from "react";
import { PaletteOptions } from "@material-ui/core/styles/createPalette";
import orange from "@material-ui/core/colors/orange";
import lime from "@material-ui/core/colors/lime";

interface Service {
  themeType: PaletteType;
  changeTheme(themeType: PaletteType): void;
}

const Context = createContext<Service | null>(null);

const PALETTES: Record<PaletteType, PaletteOptions> = {
  dark: {
    type: "dark",
    primary: orange,
    secondary: lime,
  },
  light: {
    type: "light",
  },
};

export const ThemeChangerProvider: FunctionComponent = ({ children }) => {
  const [themeType, setThemeType] = useState<PaletteType>("dark");

  const changeTheme = (themeType: PaletteType) => setThemeType(themeType);

  return (
    <Context.Provider value={{ themeType, changeTheme }}>
      <ThemeProvider
        theme={createMuiTheme({
          palette: PALETTES[themeType],
        })}
      >
        {children}
      </ThemeProvider>
    </Context.Provider>
  );
};

export const useThemeChanger = (): Service => {
  const service = useContext(Context);
  if (!service) {
    throw Error(
      "Please initialize `ThemeChangerProvider` before `useThemeChanger`"
    );
  }
  return service;
};
