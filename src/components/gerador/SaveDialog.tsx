import { useSavePassword } from "@/hooks/usePassword";
import { useUser } from "@/providers/userContext";
import { useQueryClient } from "@tanstack/react-query";
import * as Crypto from "expo-crypto";
import { useState } from "react";
import { Button, Dialog, HelperText, Text, TextInput } from "react-native-paper";

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
  const { masterKey } = useUser();
  const queryClient = useQueryClient();

  const [siteName, setSiteName] = useState<string>("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSavePassword = async () => {
    if (!siteName.trim()) {
      setError("O nome é obrigatório");
      return;
    }

    setIsLoading(true);
    setError("");

    try {
      const newUuid = Crypto.randomUUID();

      await useSavePassword(masterKey, {
        uuid: newUuid,
        name: siteName,
        pass: pass,
      });

      queryClient.invalidateQueries({ queryKey: ["passwords"] });

      setSnackBarMessage("Senha salva com sucesso!");
      setSnackbarVisible(true);

      setSaveDialogVisible(false);
      setSiteName("");
    } catch (err) {
      console.error("Erro no SaveDialog:", err);

      setSnackBarMessage("Erro ao salvar a senha. Tente novamente.");
      setSnackbarVisible(true);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDismiss = () => {
    if (!isLoading) {
      setSaveDialogVisible(false);
      setError("");
    }
  };

  return (
    <Dialog visible={saveDialogVisible} onDismiss={handleDismiss}>
      <Dialog.Title>Salvar Senha</Dialog.Title>
      <Dialog.Content>
        <Text style={{ marginBottom: 15 }}>Onde esta senha será usada?</Text>

        <TextInput
          label="Nome do Site, App ou Serviço"
          placeholder="Ex: Instagram, Banco X..."
          value={siteName}
          onChangeText={(t) => {
            setSiteName(t);
            if (error) setError("");
          }}
          mode="outlined"
          autoFocus
          disabled={isLoading}
          error={!!error}
        />
        {error ? <HelperText type="error">{error}</HelperText> : null}
      </Dialog.Content>
      <Dialog.Actions>
        <Button onPress={handleDismiss} disabled={isLoading}>
          Cancelar
        </Button>

        <Button onPress={handleSavePassword} loading={isLoading} disabled={isLoading || siteName.trim() === ""}>
          Salvar
        </Button>
      </Dialog.Actions>
    </Dialog>
  );
}
