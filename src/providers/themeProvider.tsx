import React, { createContext, ReactNode, useContext, useState } from "react";
import { useColorScheme as _useColorScheme } from "react-native";

type Theme = "light" | "dark";

type ThemeContextType = {
  theme: Theme;
  toggleTheme: () => void;
};

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export function ThemeProvider({ children }: { children: ReactNode }) {
  const systemTheme = _useColorScheme() as Theme;
  const [theme, setTheme] = useState<Theme>(systemTheme ?? "light");

  const toggleTheme = () => {
    setTheme((prev) => (prev === "light" ? "dark" : "light"));
  };

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useThemeSwitcher() {
  const ctx = useContext(ThemeContext);
  if (!ctx) throw new Error("useThemeSwitcher deve ser usado dentro de ThemeProvider");
  return ctx;
}