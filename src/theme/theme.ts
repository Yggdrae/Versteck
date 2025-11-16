import {
  configureFonts,
  MD3DarkTheme,
  MD3LightTheme,
  MD3Theme,
} from "react-native-paper";
import materialTheme from "./theme.json";

const fontConfig = {
  fontFamily: "Poppins_400Regular",
};

const fonts = configureFonts({ config: fontConfig });

const lightColors = materialTheme.schemes.light;
const darkColors = materialTheme.schemes.dark;

export const lightTheme: MD3Theme = {
  ...MD3LightTheme,
  version: 3,
  colors: {
    ...MD3LightTheme.colors,
    primary: lightColors.primary,
    onPrimary: lightColors.onPrimary,
    secondary: lightColors.secondary,
    onSecondary: lightColors.onSecondary,
    background: lightColors.background,
    onBackground: lightColors.onBackground,
    surface: lightColors.surface,
    onSurface: lightColors.onSurface,
    error: lightColors.error,
    onError: lightColors.onError,
  },
  fonts,
};

export const darkTheme: MD3Theme = {
  ...MD3DarkTheme,
  version: 3,
  colors: {
    ...MD3DarkTheme.colors,
    primary: darkColors.primary,
    onPrimary: darkColors.onPrimary,
    secondary: darkColors.secondary,
    onSecondary: darkColors.onSecondary,
    background: darkColors.background,
    onBackground: darkColors.onBackground,
    surface: darkColors.surface,
    onSurface: darkColors.onSurface,
    error: darkColors.error,
    onError: darkColors.onError,
  },
  fonts,
};
