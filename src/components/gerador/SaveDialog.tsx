import { useState } from "react";
import { Button, Dialog, Text, TextInput } from "react-native-paper";

interface SaveDialogProps {
  pass: string;
  saveDialogVisible: boolean;
  setSnackBarMessage: (message: string) => void;
  setSnackbarVisible: (state: boolean) => void;
  setSaveDialogVisible: (state: boolean) => void;
}

export default function SaveDialog({
  pass,
  saveDialogVisible,
  setSnackBarMessage,
  setSnackbarVisible,
  setSaveDialogVisible,
}: SaveDialogProps) {
  const [siteName, setSiteName] = useState<string>("");

  const handleSavePassword = () => {
    console.log("Salvou a senha ", pass);
    setSnackBarMessage("Senha salva com sucesso!");
    setSnackbarVisible(true);

    setSaveDialogVisible(false);
    setSiteName("");
  };

  return (
    <Dialog visible={saveDialogVisible} onDismiss={() => setSaveDialogVisible(false)}>
      <Dialog.Title>Salvar Senha</Dialog.Title>
      <Dialog.Content>
        <Text style={{ marginBottom: 15 }}>Onde esta senha será usada?</Text>
        <TextInput
          label="Nome do Site, App ou Serviço (URL)"
          value={siteName}
          onChangeText={setSiteName}
          mode="outlined"
          autoFocus
        />
      </Dialog.Content>
      <Dialog.Actions>
        <Button onPress={() => setSaveDialogVisible(false)}>Cancelar</Button>
        <Button onPress={handleSavePassword} disabled={siteName.trim() === ""}>
          Salvar
        </Button>
      </Dialog.Actions>
    </Dialog>
  );
}
