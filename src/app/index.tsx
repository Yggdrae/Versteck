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
  const { replace } = useRouter();
  const { setMasterKey } = useUser();

  const [inputValue, setInputValue] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const handleLogin = async () => {
    if (!inputValue) {
      setError("Preencha a chave mestra");
      return;
    }
    if (inputValue.length < 4) {
      setError("A chave deve ter no mínimo 4 caracteres");
      return;
    }

    Keyboard.dismiss();
    setError("");
    setIsLoading(true);

    try {
      const content = await readVaultFile();

      if (!content) {
        setMasterKey(inputValue);
        replace("/(tabs)/home");
      } else {
        const payload: EncryptedPayload = JSON.parse(content);

        await decryptVault(inputValue, payload);

        setMasterKey(inputValue);
        replace("/(tabs)/home");
      }
    } catch (err) {
      console.error(err);
      setError("Chave mestra incorreta. Tente novamente.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <ThemedView style={styles.container}>
        <View style={styles.header}>
          <Avatar.Icon
            size={100}
            icon="shield-key"
            style={{ backgroundColor: paperTheme.colors.primaryContainer }}
            color={paperTheme.colors.primary}
          />
          <Text variant="displaySmall" style={{ marginTop: 16, fontWeight: "bold", color: paperTheme.colors.primary }}>
            Versteck
          </Text>
          <Text variant="titleMedium" style={{ opacity: 0.6 }}>
            Seu Cofre Pessoal
          </Text>
        </View>

        <View style={styles.form}>
          <TextInput
            label="Chave Mestra"
            mode="outlined"
            value={inputValue}
            onChangeText={(text) => {
              setInputValue(text);
              if (error) setError("");
            }}
            secureTextEntry={!showPassword}
            error={!!error}
            disabled={isLoading}
            autoCapitalize="none"
            right={
              <TextInput.Icon icon={showPassword ? "eye-off" : "eye"} onPress={() => setShowPassword(!showPassword)} />
            }
          />

          <HelperText type="error" visible={!!error}>
            {error}
          </HelperText>

          <Button
            mode="contained"
            onPress={handleLogin}
            loading={isLoading}
            disabled={isLoading}
            contentStyle={{ height: 50 }}
            labelStyle={{ fontSize: 18 }}
          >
            {isLoading ? "Verificando..." : "Entrar"}
          </Button>
        </View>

        <View style={styles.footer}>
          <Text variant="labelSmall" style={{ textAlign: "center", opacity: 0.4 }}>
            Criptografia Local • Zero-Knowledge
          </Text>
        </View>
      </ThemedView>
    </TouchableWithoutFeedback>
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
    marginBottom: 40,
  },
  form: {
    gap: 10,
  },
  footer: {
    position: "absolute",
    bottom: 30,
    left: 0,
    right: 0,
  },
});
