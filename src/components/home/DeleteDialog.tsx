import { IPassword } from "@/interface/password";
import { Button, Dialog, Text } from "react-native-paper";

interface DeleteDialogProps {
  visible: boolean;
  setVisible: (v: boolean) => void;
  item: IPassword;
}

export default function DeleteDialog({ visible, setVisible, item }: DeleteDialogProps) {
  const handleDeleteItem = async () => {
    console.log("Excluindo senha do ", item.name);
    setVisible(false);
  };

  return (
    <Dialog visible={visible} onDismiss={() => setVisible(false)}>
      <Dialog.Title>Salvar Senha</Dialog.Title>
      <Dialog.Content>
        <Text style={{ marginBottom: 15 }}>Tem certeza que deseja excluir sua senha de </Text>
      </Dialog.Content>
      <Dialog.Actions>
        <Button onPress={() => setVisible(false)}>Cancelar</Button>
        <Button onPress={handleDeleteItem}>Excluir</Button>
      </Dialog.Actions>
    </Dialog>
  );
}
