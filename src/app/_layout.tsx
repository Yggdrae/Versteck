import { KeyProvider } from "@/providers/keyContext";
import { ThemeProvider, useThemeSwitcher } from "@/providers/themeProvider";
import { UserInfoProvider } from "@/providers/userContext";
import { darkTheme, lightTheme } from "@/theme/theme";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useFonts } from "expo-font";
import { SplashScreen, Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import * as Updates from "expo-updates";
import { useEffect } from "react";
import { PaperProvider, Portal } from "react-native-paper";

SplashScreen.preventAutoHideAsync();
const queryClient = new QueryClient();

export default function RootLayout() {
  const [fontsLoaded, fontError] = useFonts({
    Poppins_400Regular: require("@/assets/fonts/Poppins-Regular.ttf"),
    Poppins_500Medium: require("@/assets/fonts/Poppins-Medium.ttf"),
    Poppins_600SemiBold: require("@/assets/fonts/Poppins-SemiBold.ttf"),
    Poppins_700Bold: require("@/assets/fonts/Poppins-Bold.ttf"),
  });

  useEffect(() => {
    async function prepareApp() {
      try {
        if (!__DEV__) {
          const update = await Updates.checkForUpdateAsync();

          if (update.isAvailable) {
            await Updates.fetchUpdateAsync();
            await Updates.reloadAsync();
          }
        }
      } catch (error) {
        console.warn(`Error fetching latest update: ${error}`);
      } finally {
        if (fontsLoaded || fontError) {
          SplashScreen.hideAsync();
        }
      }
    }

    prepareApp();
  }, [fontsLoaded, fontError]);

  if (!fontsLoaded && !fontError) {
    return null;
  }

  return (
    <ThemeProvider>
      <RootLayoutContent />
    </ThemeProvider>
  );
}

function RootLayoutContent() {
  const { theme } = useThemeSwitcher();

  return (
    <PaperProvider theme={theme === "dark" ? darkTheme : lightTheme}>
      <Portal>
        <QueryClientProvider client={queryClient}>
          <UserInfoProvider>
            <KeyProvider>
              <Stack>
                <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
                <Stack.Screen name="index" options={{ headerShown: false }} />
              </Stack>
              <StatusBar style="auto" />
            </KeyProvider>
          </UserInfoProvider>
        </QueryClientProvider>
      </Portal>
    </PaperProvider>
  );
}
