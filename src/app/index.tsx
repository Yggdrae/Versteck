import { ThemedView } from "@/components/ThemedView";
import { useUser } from "@/providers/userContext";
import { useRouter } from "expo-router";
import { useState } from "react";
import { StyleSheet } from "react-native";
import { Button, Text, TextInput } from "react-native-paper";

type Errors = {
  user?: string;
  key?: string;
};

export default function Index() {
  const { replace } = useRouter();
  const { masterKey, setMasterKey } = useUser();
  const [errors, setErrors] = useState<Errors>({});

  const checkFields = () => {
    let newErrors: Errors = {};
    let isValid = true;

    if (!masterKey) {
      newErrors.key = "Preencha a chave mestra";
      isValid = false;
    } else if (masterKey.length < 4) {
      newErrors.key = "Chave mestra precisa ter ao menos 4 caracteres";
      isValid = false;
    }

    setErrors(newErrors);

    return isValid;
  };

  const handleLogin = async () => {
    if (checkFields()) {
      replace("/(tabs)/home");
    }
  };

  return (
    <ThemedView style={styles.container}>
      <ThemedView>
        <TextInput
          label="Chave mestra"
          value={masterKey}
          onChangeText={(text) => setMasterKey(text)}
          error={!!errors.key}
          secureTextEntry
        />
        {errors.key && <Text style={styles.errorText}>{errors.key}</Text>}
      </ThemedView>
      <Button style={styles.button} mode="contained" onPress={handleLogin}>
        Entrar
      </Button>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    padding: 20,
    gap: 20,
  },
  button: {
    marginHorizontal: 28,
  },
  errorText: {
    color: "red",
  },
});
