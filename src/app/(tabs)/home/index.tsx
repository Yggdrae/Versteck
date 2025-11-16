import { ThemedSafeAreaView } from "@/components/ThemedSafeArea";
import { usePasswords } from "@/hooks/usePassword";
import React from "react";
import { ScrollView, StyleSheet, View } from "react-native";
import { ActivityIndicator, Text } from "react-native-paper";
1;

export default function Home() {
  const { data: passwords, isLoading, isError, error } = usePasswords();

  if (isLoading) {
    return (
      <ThemedSafeAreaView style={styles.container}>
        <View style={styles.emptyContainer}>
          <ActivityIndicator size="large" />
          <Text style={{ marginTop: 10 }}>Carregando senhas...</Text>
        </View>
      </ThemedSafeAreaView>
    );
  }

  if (isError) {
    return (
      <ThemedSafeAreaView style={styles.container}>
        <View style={styles.emptyContainer}>
          <Text>Erro ao carregar senhas: {error.message}</Text>
        </View>
      </ThemedSafeAreaView>
    );
  }

  const passwordList = passwords || [];

  return (
    <ThemedSafeAreaView style={styles.container}>
      {passwordList.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Text>Não há senhas a serem mostradas</Text>
        </View>
      ) : (
        <ScrollView style={styles.contentContainer}>
          <Text variant="titleLarge">Suas {passwordList.length} senhas</Text>
        </ScrollView>
      )}
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
    gap: 8,
    padding: 24,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
});
