import { IPassword } from "@/interface/password";
import { useState } from "react";
import { StyleSheet } from "react-native";
import { Card, IconButton, TextInput, useTheme } from "react-native-paper";

interface PassCardProps {
  item: IPassword;
  openDialog: (item: IPassword, type: "delete" | "edit") => void;
  copyToClipboard: (pass: string) => void;
}

export default function PassCard({ item, openDialog, copyToClipboard }: PassCardProps) {
  const [showPass, setShowPass] = useState<boolean>(false);
  const theme = useTheme();

  return (
    <Card style={styles.card}>
      <Card.Title title={item.name} titleStyle={{ fontSize: 24 }} />
      <Card.Content>
        <TextInput
          label="Senha"
          secureTextEntry={!showPass}
          value={item.pass}
          mode="outlined"
          editable={false}
          right={
            showPass ? (
              <TextInput.Icon icon="eye" onPress={() => setShowPass(false)} />
            ) : (
              <TextInput.Icon icon="eye-off" onPress={() => setShowPass(true)} />
            )
          }
        />
      </Card.Content>

      <Card.Actions style={styles.actions}>
        <IconButton
          icon="delete-outline"
          iconColor={theme.colors.error}
          onPress={() => openDialog(item, "delete")}
          size={24}
        />

        <IconButton icon="pencil-outline" onPress={() => openDialog(item, "edit")} size={24} />

        <IconButton icon="content-copy" onPress={() => copyToClipboard(item.pass)} size={24} />
      </Card.Actions>
    </Card>
  );
}

const styles = StyleSheet.create({
  card: {
    elevation: 4,
    marginBottom: 20,
    padding: 8,
  },
  actions: {
    justifyContent: "flex-end",
  },
});
