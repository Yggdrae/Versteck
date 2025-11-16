import { ThemedSafeAreaView } from "@/components/ThemedSafeArea";
import { ThemedView } from "@/components/ThemedView";
import { useThemeSwitcher } from "@/providers/themeProvider";
import { useRouter } from "expo-router";
import { StyleSheet } from "react-native";
import { Avatar, Button, Divider, Switch, Text } from "react-native-paper";

export default function Settings() {
  const { theme, toggleTheme } = useThemeSwitcher();
  const { replace } = useRouter();

  const logout = () => {
    replace("/");
  };

  return (
    <ThemedSafeAreaView style={styles.container}>
      <ThemedView style={styles.content}>
        <ThemedView style={styles.userInfo}>
          <Avatar.Image
            style={styles.avatar}
            size={150}
            source={require("@/assets/images/icon-example.jpg")}
          />
          <Text style={styles.userName} variant="titleLarge">
            Gyro Zeppeli
          </Text>
        </ThemedView>

        <Divider />

        <ThemedView style={styles.config}>
          <Text variant="bodyLarge">Tema Escuro:</Text>
          <Switch onChange={toggleTheme} value={theme === "dark"} />
        </ThemedView>
      </ThemedView>

      <Button mode="elevated" icon="logout" onPress={logout}>
        Logout
      </Button>
    </ThemedSafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    justifyContent: "space-between",
  },
  content: {
    gap: 20,
  },
  userInfo: {
    gap: 8,
  },
  avatar: {
    alignSelf: "center",
  },
  userName: {
    textAlign: "center",
  },
  config: {
    justifyContent: "space-between",
    alignItems: "center",
    flexDirection: "row",
    paddingHorizontal: 20,
  },
});
