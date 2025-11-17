import { useChangeMasterKey } from "@/hooks/useChangeMasterKey";
import { useState } from "react";
import { Alert } from "react-native";
import { Button, Dialog, HelperText, TextInput } from "react-native-paper";

interface Props {
  visible: boolean;
  onDismiss: () => void;
}

export default function ChangeMasterKeyDialog({ visible, onDismiss }: Props) {
  const { changeKey } = useChangeMasterKey();
  const [isLoading, setIsLoading] = useState(false);

  const [oldKey, setOldKey] = useState("");
  const [newKey, setNewKey] = useState("");
  const [confirmKey, setConfirmKey] = useState("");

  const [showPassword, setShowPassword] = useState(false);

  const handleConfirm = async () => {
    if (newKey !== confirmKey) {
      Alert.alert("Erro", "A nova senha e a confirmação não coincidem.");
      return;
    }

    if (newKey.length < 4) {
      Alert.alert("Erro", "A nova senha é muito curta.");
      return;
    }

    setIsLoading(true);

    try {
      await changeKey(oldKey, newKey);
      Alert.alert("Sucesso", "Chave Mestra alterada com sucesso!");
      resetAndClose();
    } catch (error) {
      Alert.alert("Erro", "Não foi possível alterar a senha. Verifique sua senha atual.");
    } finally {
      setIsLoading(false);
    }
  };

  const resetAndClose = () => {
    setOldKey("");
    setNewKey("");
    setConfirmKey("");
    onDismiss();
  };

  return (
    <Dialog visible={visible} onDismiss={resetAndClose}>
      <Dialog.Title>Alterar Chave Mestra</Dialog.Title>
      <Dialog.Content style={{ gap: 10 }}>
        <TextInput
          label="Senha Atual"
          value={oldKey}
          onChangeText={setOldKey}
          secureTextEntry={!showPassword}
          mode="outlined"
          disabled={isLoading}
        />

        <TextInput
          label="Nova Senha"
          value={newKey}
          onChangeText={setNewKey}
          secureTextEntry={!showPassword}
          mode="outlined"
          disabled={isLoading}
        />

        <TextInput
          label="Confirmar Nova Senha"
          value={confirmKey}
          onChangeText={setConfirmKey}
          secureTextEntry={!showPassword}
          mode="outlined"
          disabled={isLoading}
          right={
            <TextInput.Icon icon={showPassword ? "eye-off" : "eye"} onPress={() => setShowPassword(!showPassword)} />
          }
        />

        {newKey !== confirmKey && confirmKey.length > 0 && (
          <HelperText type="error" visible={true}>
            As senhas não coincidem.
          </HelperText>
        )}
      </Dialog.Content>
      <Dialog.Actions>
        <Button onPress={resetAndClose} disabled={isLoading}>
          Cancelar
        </Button>
        <Button onPress={handleConfirm} loading={isLoading} disabled={isLoading || !oldKey || !newKey || !confirmKey}>
          Alterar
        </Button>
      </Dialog.Actions>
    </Dialog>
  );
}
