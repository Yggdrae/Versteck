import { IPassword } from "@/interface/password";
import { useState } from "react";
import { Button, Dialog, Text, TextInput } from "react-native-paper";

interface EditDialogProps {
  visible: boolean;
  setVisible: (v: boolean) => void;
  item: IPassword;
}

export default function EditDialog({ visible, setVisible, item }: EditDialogProps) {
  const [password, setPassword] = useState("");

  const handleEditItem = async () => {
    console.log("Excluindo senha do ", item.name);
  };

  return (
    <Dialog visible={visible} onDismiss={() => setVisible(false)}>
      <Dialog.Title>Salvar Senha</Dialog.Title>
      <Dialog.Content>
        <Text style={{ marginBottom: 15 }}>Alterar a senha de {item.name}?</Text>
        <TextInput
          label="Nome do Site, App ou Serviço (URL)"
          value={password}
          onChangeText={setPassword}
          mode="outlined"
          autoFocus
        />
      </Dialog.Content>
      <Dialog.Actions>
        <Button onPress={() => setVisible(false)}>Cancelar</Button>
        <Button onPress={handleEditItem} disabled={password === ""}>
          Salvar
        </Button>
      </Dialog.Actions>
    </Dialog>
  );
}
