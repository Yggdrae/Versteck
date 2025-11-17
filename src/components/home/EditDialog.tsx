import { useEditPassword } from "@/hooks/usePassword";
import { IPassword } from "@/interface/password";
import { useUser } from "@/providers/userContext";
import { useQueryClient } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import { Button, Dialog, TextInput } from "react-native-paper";

interface EditDialogProps {
  visible: boolean;
  setVisible: (v: boolean) => void;
  item: IPassword;
}

export default function EditDialog({ visible, setVisible, item }: EditDialogProps) {
  const { masterKey } = useUser();
  const queryClient = useQueryClient();

  const [name, setName] = useState(item.name);
  const [pass, setPass] = useState(item.pass);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (visible) {
      setName(item.name);
      setPass(item.pass);
    }
  }, [item, visible]);

  const handleEdit = async () => {
    setIsLoading(true);
    try {
      await useEditPassword(masterKey, { uuid: item.uuid, name, pass });

      queryClient.invalidateQueries({ queryKey: ["passwords"] });
      setVisible(false);
    } catch (e) {
      console.error(e);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog visible={visible} onDismiss={() => !isLoading && setVisible(false)}>
      <Dialog.Title>Editar Senha</Dialog.Title>
      <Dialog.Content style={{ gap: 10 }}>
        <TextInput label="Nome" value={name} onChangeText={setName} mode="outlined" disabled={isLoading} />
        <TextInput label="Senha" value={pass} onChangeText={setPass} mode="outlined" disabled={isLoading} />
      </Dialog.Content>
      <Dialog.Actions>
        <Button onPress={() => setVisible(false)} disabled={isLoading}>
          Cancelar
        </Button>
        <Button onPress={handleEdit} loading={isLoading} disabled={isLoading}>
          Salvar
        </Button>
      </Dialog.Actions>
    </Dialog>
  );
}
