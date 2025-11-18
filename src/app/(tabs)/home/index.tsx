import DeleteDialog from "@/components/home/DeleteDialog";
import EditDialog from "@/components/home/EditDialog";
import PassCard from "@/components/home/PassCard";
import { ThemedSafeAreaView } from "@/components/ThemedSafeArea";
import { useLoadPasswords } from "@/hooks/usePassword";
import { IPassword } from "@/interface/password";
import { useQueryClient } from "@tanstack/react-query";
import * as Clipboard from "expo-clipboard";
import React, { useState } from "react";
import { FlatList, StyleSheet, View } from "react-native";
import { ActivityIndicator, Button, Icon, Snackbar, Text, useTheme } from "react-native-paper";

export default function Home() {
  const theme = useTheme();
  const queryClient = useQueryClient();

  const [deleteDialogVisible, setDeleteDialogVisible] = useState<boolean>(false);
  const [editDialogVisible, setEditDialogVisible] = useState(false);
  const [pressedItem, setPressedItem] = useState<IPassword>({ uuid: "", name: "", pass: "" });

  const { data: passwords, isLoading: loading, error } = useLoadPasswords();

  const openDialog = (item: IPassword, type: "delete" | "edit") => {
    setPressedItem(item);

    if (type === "delete") {
      setDeleteDialogVisible(true);
    } else if (type === "edit") {
      setEditDialogVisible(true);
    }
  };

  const [snackbarVisible, setSnackbarVisible] = useState(false);
  const [snackBarMessage, setSnackBarMessage] = useState("");

  const copyToClipboard = async (pass: string) => {
    await Clipboard.setStringAsync(pass);
    setSnackBarMessage("Senha copiada para a área de transferência!");
    setSnackbarVisible(true);
  };

  const onDismissSnackbar = () => setSnackbarVisible(false);

  if (loading) {
    return (
      <ThemedSafeAreaView style={styles.container}>
        <View style={styles.emptyContainer}>
          <ActivityIndicator size="large" />
          <Text style={{ marginTop: 10 }}>Carregando senhas...</Text>
        </View>
      </ThemedSafeAreaView>
    );
  }

  if (error) {
    return (
      <ThemedSafeAreaView style={styles.container}>
        <View style={styles.emptyContainer}>
          <Icon source="alert-circle-outline" size={64} color={theme.colors.error} />

          <Text variant="titleMedium" style={{ color: theme.colors.error, marginTop: 16 }}>
            Ocorreu um erro
          </Text>

          <Text style={{ textAlign: "center", marginVertical: 8, paddingHorizontal: 20 }}>
            {error.message || "Não foi possível descriptografar o cofre."}
          </Text>

          <Button
            mode="contained-tonal"
            onPress={() => queryClient.invalidateQueries({ queryKey: ["passwords"] })}
            style={{ marginTop: 10 }}
          >
            Tentar Novamente
          </Button>
        </View>
      </ThemedSafeAreaView>
    );
  }

  const passwordList = passwords || [];

  return (
    <ThemedSafeAreaView style={styles.container}>
      {passwordList.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Icon source="safe" size={64} color={theme.colors.secondary} />
          <Text style={{ marginTop: 16 }}>Não há senhas a serem mostradas</Text>
        </View>
      ) : (
        <FlatList
          data={passwordList}
          keyExtractor={(item) => item.uuid}
          contentContainerStyle={styles.contentContainer}
          renderItem={({ item }) => <PassCard item={item} copyToClipboard={copyToClipboard} openDialog={openDialog} />}
        />
      )}

      <Snackbar
        visible={snackbarVisible}
        onDismiss={onDismissSnackbar}
        duration={2000}
        action={{
          label: "OK",
          onPress: onDismissSnackbar,
        }}
      >
        {snackBarMessage}
      </Snackbar>

      <DeleteDialog visible={deleteDialogVisible} setVisible={setDeleteDialogVisible} item={pressedItem} />
      <EditDialog visible={editDialogVisible} setVisible={setEditDialogVisible} item={pressedItem} />
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
    gap: 12,
    padding: 24,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
});
