import { ThemedSafeAreaView } from "@/components/ThemedSafeArea";
import ChangeMasterKeyDialog from "@/components/settings/ChangeMasterKeyDialog";
import { useDeleteAccount } from "@/hooks/useRegister";
import { useThemeSwitcher } from "@/providers/themeProvider";
import { useUser } from "@/providers/userContext";
import { File, Paths } from "expo-file-system";
import { useRouter } from "expo-router";
import * as Sharing from "expo-sharing";
import { useState } from "react";
import { Alert, StyleSheet, View } from "react-native";
import { Avatar, Button, Divider, List, Switch, Text, useTheme } from "react-native-paper";

export default function Settings() {
  const { theme, toggleTheme } = useThemeSwitcher();
  const paperTheme = useTheme();
  const { replace } = useRouter();
  const { setMasterKey } = useUser();
  const [changeKeyVisible, setChangeKeyVisible] = useState(false);

  const { mutateAsync: deleteAccount } = useDeleteAccount();

  const vaultFile = new File(Paths.document, "versteck_vault.json");

  const handleBackup = async () => {
    try {
      if (!vaultFile.exists) {
        Alert.alert("Erro", "Você ainda não tem um cofre criado para exportar.");
        return;
      }

      if (!(await Sharing.isAvailableAsync())) {
        Alert.alert("Erro", "Compartilhamento não disponível neste dispositivo.");
        return;
      }

      await Sharing.shareAsync(vaultFile.uri, {
        dialogTitle: "Backup do Cofre Versteck",
        mimeType: "application/json",
        UTI: "public.json",
      });
    } catch (error) {
      Alert.alert("Erro", "Falha ao preparar o backup.");
      console.error(error);
    }
  };

  const handleWipeData = () => {
    Alert.alert(
      "Zona de Perigo",
      "Tem certeza absoluta? Isso apagará TODAS as suas senhas permanentemente. Essa ação é irreversível.",
      [
        { text: "Cancelar", style: "cancel" },
        {
          text: "Sim, Apagar Tudo",
          style: "destructive",
          onPress: async () => {
            try {
              if (vaultFile.exists) {
                await vaultFile.delete();
                await deleteAccount();
              }

              setMasterKey("");
              replace("/");
              Alert.alert("Sucesso", "Sua conta foi excluída.");
            } catch (e) {
              Alert.alert("Erro", "Falha ao apagar dados.");
              console.error(e);
            }
          },
        },
      ]
    );
  };

  const logout = () => {
    setMasterKey("");
    replace("/");
  };

  return (
    <ThemedSafeAreaView style={styles.container}>
      <View>
        <View style={styles.header}>
          <Avatar.Icon size={80} icon="shield-lock" style={{ backgroundColor: paperTheme.colors.primary }} />
          <Text variant="headlineMedium" style={{ marginTop: 10, fontWeight: "bold" }}>
            Versteck
          </Text>
          <Text variant="bodySmall" style={{ opacity: 0.7 }}>
            Cofre Local Seguro v1.0
          </Text>
        </View>

        <List.Section>
          <List.Subheader>Geral</List.Subheader>

          <List.Item
            title="Tema Escuro"
            left={() => <List.Icon icon="theme-light-dark" />}
            right={() => <Switch value={theme === "dark"} onValueChange={toggleTheme} />}
          />

          <Divider />
          <List.Subheader>Segurança</List.Subheader>

          <List.Item
            title="Alterar Chave Mestra"
            description="Mude a senha que abre seu cofre"
            left={() => <List.Icon icon="key-change" />}
            onPress={() => setChangeKeyVisible(true)}
          />

          {/* <List.Item
            title="Fazer Backup"
            description="Exporte seus dados criptografados"
            left={() => <List.Icon icon="cloud-upload" />}
            onPress={handleBackup}
          /> */}
        </List.Section>

        <List.Section>
          <List.Subheader style={{ color: paperTheme.colors.error }}>Zona de Perigo</List.Subheader>
          <List.Item
            title="Apagar minha conta"
            titleStyle={{ color: paperTheme.colors.error }}
            left={() => <List.Icon icon="delete-forever" color={paperTheme.colors.error} />}
            onPress={handleWipeData}
          />
        </List.Section>
      </View>

      <Button mode="outlined" icon="logout" onPress={logout} style={{ marginBottom: 20 }}>
        Sair (Bloquear)
      </Button>

      <ChangeMasterKeyDialog visible={changeKeyVisible} onDismiss={() => setChangeKeyVisible(false)} />
    </ThemedSafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 20,
    justifyContent: "space-between",
  },
  header: {
    alignItems: "center",
    marginVertical: 20,
  },
});
