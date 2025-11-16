import DeleteDialog from "@/components/home/DeleteDialog";
import PassCard from "@/components/home/PassCard";
import { ThemedSafeAreaView } from "@/components/ThemedSafeArea";
import { IPassword } from "@/interface/password";
import { useKey } from "@/providers/keyContext";
import * as Clipboard from "expo-clipboard";
import React, { useState } from "react";
import { ScrollView, StyleSheet, View } from "react-native";
import { ActivityIndicator, Snackbar, Text } from "react-native-paper";

export default function Home() {
  const [deleteDialogVisible, setDeleteDialogVisible] = useState<boolean>(false);
  const [editDialogVisible, setEditDialogVisible] = useState<boolean>(false);
  const [pressedItem, setPressedItem] = useState<IPassword>({ uuid: "", name: "", pass: "" });

  const openDialog = (item: IPassword, type: "delete" | "edit") => {
    if (type === "delete") {
      setPressedItem(item);
      setDeleteDialogVisible(true);
    }
  };

  const [loading, setLoading] = useState<boolean>(false);
  const { keys } = useKey();

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

  const passwordList = keys || [];

  return (
    <ThemedSafeAreaView style={styles.container}>
      {passwordList.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Text>Não há senhas a serem mostradas</Text>
        </View>
      ) : (
        <ScrollView style={styles.contentContainer}>
          {passwordList.map((password) => (
            <PassCard key={password.uuid} item={password} copyToClipboard={copyToClipboard} openDialog={openDialog} />
          ))}
        </ScrollView>
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
    gap: 20,
    padding: 24,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
});
