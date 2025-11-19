import { ThemedSafeAreaView } from "@/components/ThemedSafeArea";
import { ThemedView } from "@/components/ThemedView";
import { useUser } from "@/providers/userContext";
import { decryptVault, EncryptedPayload } from "@/service/encrypt";
import { readVaultFile } from "@/service/storage";
import { useRouter } from "expo-router";
import { useState } from "react";
import { Keyboard, StyleSheet, TouchableWithoutFeedback, View } from "react-native";
import { Avatar, Button, HelperText, Text, TextInput, useTheme } from "react-native-paper";

export default function Index() {
  const paperTheme = useTheme();
  const { replace, push } = useRouter();
  const { setMasterKey } = useUser();

  const [emailInput, setEmailInput] = useState("");
  const [emailError, setEmailError] = useState("");

  const [masterKeyInput, setMasterKeyInput] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [masterKeyError, setMasterKeyError] = useState("");

  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = async () => {
    let hasError = false;
    if (!emailInput || !emailInput.includes("@")) {
      setEmailError("E-mail inválido");
      hasError = true;
    }
    if (!masterKeyInput || masterKeyInput.length < 4) {
      setMasterKeyError("Senha inválida");
      hasError = true;
    }
    if (hasError) return;

    Keyboard.dismiss();
    setEmailError("");
    setMasterKeyError("");
    setIsLoading(true);

    try {
      const localContent = await readVaultFile();

      if (!localContent) {
        setMasterKeyError("Nenhum cofre encontrado. Crie uma conta.");
        setIsLoading(false);
        return;
      }

      const payload: EncryptedPayload = JSON.parse(localContent);

      await decryptVault(masterKeyInput, payload);

      setMasterKey(masterKeyInput);
      replace("/(tabs)/home");

    } catch (err) {
      console.error(err);
      setMasterKeyError("Chave mestra incorreta. Tente novamente.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <ThemedSafeAreaView>
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <ThemedView style={styles.container}>

          <View style={styles.header}>
            <Avatar.Icon
              size={100}
              icon="shield-key"
              style={{ backgroundColor: paperTheme.colors.primaryContainer }}
              color={paperTheme.colors.primary}
            />
            <Text
              variant="displaySmall"
              style={{ marginTop: 16, fontWeight: "bold", color: paperTheme.colors.primary }}
            >
              Versteck
            </Text>
            <Text variant="titleMedium" style={{ opacity: 0.6 }}>
              Seu Cofre Pessoal
            </Text>
          </View>

          <View style={styles.form}>
            <TextInput
              label="E-mail"
              mode="outlined"
              value={emailInput}
              onChangeText={(text) => {
                setEmailInput(text);
                if (emailError) setEmailError("");
              }}
              error={!!emailError}
              disabled={isLoading}
              autoCapitalize="none"
              keyboardType="email-address"
            />
            <HelperText type="error" visible={!!emailError}>
              {emailError}
            </HelperText>

            <TextInput
              label="Chave Mestra"
              mode="outlined"
              value={masterKeyInput}
              onChangeText={(text) => {
                setMasterKeyInput(text);
                if (masterKeyError) setMasterKeyError("");
              }}
              secureTextEntry={!showPassword}
              error={!!masterKeyError}
              disabled={isLoading}
              autoCapitalize="none"
              right={
                <TextInput.Icon
                  icon={showPassword ? "eye-off" : "eye"}
                  onPress={() => setShowPassword(!showPassword)}
                />
              }
            />
            <HelperText type="error" visible={!!masterKeyError}>
              {masterKeyError}
            </HelperText>

            <Button
              mode="contained"
              onPress={handleLogin}
              loading={isLoading}
              disabled={isLoading}
              contentStyle={{ height: 50 }}
              labelStyle={{ fontSize: 18 }}
            >
              {isLoading ? "Descriptografando..." : "Entrar"}
            </Button>

            <Button
              mode="outlined"
              onPress={() => push("/cadastro")}
              disabled={isLoading}
              contentStyle={{ height: 50 }}
              labelStyle={{ fontSize: 18 }}
            >
              Criar Conta
            </Button>
          </View>

          <View style={styles.footer}>
            <Text variant="labelSmall" style={{ textAlign: "center", opacity: 0.4 }}>
              Criptografia Zero-Knowledge
            </Text>
          </View>
        </ThemedView>
      </TouchableWithoutFeedback>
    </ThemedSafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 24,
    justifyContent: "center",
  },
  header: {
    alignItems: "center",
    marginBottom: 30,
  },
  form: {
    gap: 5,
  },
  footer: {
    position: "absolute",
    bottom: 30,
    left: 0,
    right: 0,
  },
});