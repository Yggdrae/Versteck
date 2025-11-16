import PasswordGeneratorCard from "@/components/gerador/PasswordGeneratorCard";
import { ThemedSafeAreaView } from "@/components/ThemedSafeArea";
import { ThemedView } from "@/components/ThemedView";
import { StyleSheet } from "react-native";

export default function Gerador() {
  return (
    <ThemedSafeAreaView style={styles.container}>
      <ThemedView style={styles.contentContainer}>
        <PasswordGeneratorCard />
      </ThemedView>
    </ThemedSafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    padding: 8,
  },
  contentContainer: {
    flex: 1,
    justifyContent: "center",
    padding: 20,
  },
});
