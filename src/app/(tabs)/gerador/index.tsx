import PasswordGeneratorCard from "@/components/gerador/PasswordGeneratorCard";
import SaveDialog from "@/components/gerador/SaveDialog";
import { ThemedSafeAreaView } from "@/components/ThemedSafeArea";
import { ThemedView } from "@/components/ThemedView";
import * as Clipboard from "expo-clipboard";
import { useState } from "react";
import { StyleSheet } from "react-native";
import { Snackbar } from "react-native-paper";

export default function Gerador() {
  const [snackbarVisible, setSnackbarVisible] = useState<boolean>(false);
  const [snackBarMessage, setSnackBarMessage] = useState<string>("");

  const [passToSave, setPassToSave] = useState<string>("");
  const [saveDialogVisible, setSaveDialogVisible] = useState<boolean>(false);

  const copyToClipboard = async (pass: string) => {
    if (!pass) return;
    await Clipboard.setStringAsync(pass);
    setSnackBarMessage("Senha copiada para a área de transferência!");
    setSnackbarVisible(true);
  };

  const showSaveDialog = (pass: string) => {
    if (!pass) {
      setSnackBarMessage("Gere a senha primeiro!");
      setSnackbarVisible(true);
      return;
    }
    setPassToSave(pass);
    setSaveDialogVisible(true);
  };

  const onDismissSnackbar = () => setSnackbarVisible(false);
  return (
    <ThemedSafeAreaView style={styles.container}>
      <ThemedView style={styles.contentContainer}>
        <PasswordGeneratorCard copyToClipboard={copyToClipboard} showSaveDialog={showSaveDialog} />

        <SaveDialog
          pass={passToSave}
          saveDialogVisible={saveDialogVisible}
          setSnackBarMessage={setSnackBarMessage}
          setSnackbarVisible={setSnackbarVisible}
          setSaveDialogVisible={setSaveDialogVisible}
        />

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
