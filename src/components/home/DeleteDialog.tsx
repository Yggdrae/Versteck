import { useDeletePassword } from "@/hooks/usePassword";
import { IPassword } from "@/interface/password";
import { useUser } from "@/providers/userContext";
import { useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { Button, Dialog, Text } from "react-native-paper";

interface DeleteDialogProps {
  visible: boolean;
  setVisible: (v: boolean) => void;
  item: IPassword;
}

export default function DeleteDialog({ visible, setVisible, item }: DeleteDialogProps) {
  const { masterKey } = useUser();
  const queryClient = useQueryClient();
  const [isLoading, setIsLoading] = useState(false);

  const handleDeleteItem = async () => {
    if (!masterKey) return;

    setIsLoading(true);

    try {
      await useDeletePassword(masterKey, item.uuid);

      await queryClient.invalidateQueries({ queryKey: ["passwords"] });

      console.log("Excluindo senha do ", item.name);
      setVisible(false);
    } catch (error) {
      console.error("Erro ao deletar:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog visible={visible} onDismiss={() => !isLoading && setVisible(false)}>
      <Dialog.Title>Excluir Senha</Dialog.Title>
      <Dialog.Content>
        <Text style={{ marginBottom: 15 }}>
          Tem certeza que deseja excluir sua senha de <Text style={{ fontWeight: "bold" }}>{item.name}</Text>?
        </Text>
        <Text variant="bodySmall" style={{ color: "red" }}>
          Essa ação não pode ser desfeita.
        </Text>
      </Dialog.Content>
      <Dialog.Actions>
        <Button onPress={() => setVisible(false)} disabled={isLoading}>
          Cancelar
        </Button>
        <Button onPress={handleDeleteItem} loading={isLoading} disabled={isLoading} textColor="red">
          Excluir
        </Button>
      </Dialog.Actions>
    </Dialog>
  );
}
