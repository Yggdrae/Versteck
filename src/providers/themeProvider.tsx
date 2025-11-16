import { getItem, saveItem } from "@/hooks/useAsyncStorage";
import React, {
  createContext,
  ReactNode,
  useContext,
  useEffect,
  useState,
} from "react";
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

  useEffect(() => {
    const loadPreferredTheme = async () => {
      try {
        const savedTheme = await getItem({ key: "preferredTheme" });
        if (savedTheme) {
          const parsedTheme = JSON.parse(savedTheme) as Theme;
          setTheme(parsedTheme);
        }
      } catch (error) {
        console.error("Falha ao carregar o tema:", error);
      }
    };

    loadPreferredTheme();
  }, []);

  const toggleTheme = async () => {
    const newTheme = theme === "light" ? "dark" : "light";

    try {
      await saveItem({ key: "preferredTheme", value: newTheme });
      setTheme(newTheme);
    } catch (error) {
      console.error("Falha ao salvar o tema:", error);
    }
  };

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useThemeSwitcher() {
  const ctx = useContext(ThemeContext);
  if (!ctx)
    throw new Error("useThemeSwitcher deve ser usado dentro de ThemeProvider");
  return ctx;
}
