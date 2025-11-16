import { generatePassword } from "@/service/generatePassword";
import * as Clipboard from "expo-clipboard";
import React, { useState } from "react";
import { StyleSheet, View } from "react-native";
import {
    Button,
    Card,
    Dialog,
    IconButton,
    Snackbar,
    Switch,
    Text,
    TextInput,
} from "react-native-paper";

const MIN_LENGTH = 8;
const MAX_LENGTH = 64;

export default function PasswordGeneratorCard() {
  const [snackbarVisible, setSnackbarVisible] = useState(false);
  const [snackBarMessage, setSnackBarMessage] = useState("");

  const [saveDialogVisible, setSaveDialogVisible] = useState(false);
  const [siteName, setSiteName] = useState("");

  const [generatedPassword, setGeneratedPassword] = useState("");
  const [containsNumeric, setContainsNumeric] = useState(true);
  const [containsLowerCase, setContainsLowerCase] = useState(true);
  const [containsUpperCase, setContainsUpperCase] = useState(true);
  const [containsSpecialChar, setContainsSpecialChar] = useState(true);
  const [length, setLength] = useState(32);

  const handleGenerate = () => {
    setGeneratedPassword(
      generatePassword({
        length,
        containsNumeric,
        containsLowerCase,
        containsUpperCase,
        containsSpecialChar,
      })
    );
  };

  const copyToClipboard = async () => {
    if (!generatedPassword) return;
    await Clipboard.setStringAsync(generatedPassword);
    setSnackBarMessage("Senha copiada para a área de transferência!");
    setSnackbarVisible(true);
  };

  const onDismissSnackbar = () => setSnackbarVisible(false);

  const showSaveDialog = () => {
    if (!generatedPassword) {
      setSnackBarMessage("Gere a senha primeiro!");
      setSnackbarVisible(true);
      return;
    }
    setSiteName("");
    setSaveDialogVisible(true);
  };

  const handleSavePassword = () => {
    setSnackBarMessage("Senha salva com sucesso!");
    setSnackbarVisible(true);

    setSaveDialogVisible(false);
  };

  const handleBlur = () => {
    let numValue = length;

    if (numValue === 0 || isNaN(numValue)) {
      numValue = MIN_LENGTH;
    }

    if (numValue < MIN_LENGTH) numValue = MIN_LENGTH;
    if (numValue > MAX_LENGTH) numValue = MAX_LENGTH;

    setLength(numValue);
  };

  const handleLengthChange = (value: string) => {
    const cleanedValue = value.replace(/[^0-9]/g, "");

    const numValue = Number(cleanedValue);

    let finalValue = numValue;

    if (numValue > MAX_LENGTH) {
      finalValue = MAX_LENGTH;
    }
    setLength(finalValue);
  };

  const incrementLength = (delta: 1 | -1) => {
    let newLength = length + delta;
    if (newLength < MIN_LENGTH) newLength = MIN_LENGTH;
    if (newLength > MAX_LENGTH) newLength = MAX_LENGTH;
    setLength(newLength);
  };

  return (
    <>
      <Card style={styles.card}>
        <Card.Title title="Gerador de Senhas" />

        <Card.Content>
          <TextInput
            label="Senha Gerada"
            value={generatedPassword}
            mode="outlined"
            editable={false}
            style={styles.input}
            right={
              generatedPassword ? (
                <TextInput.Icon icon="content-copy" onPress={copyToClipboard} />
              ) : null
            }
          />
          <View style={styles.settingRow}>
            <Text>Incluir Números?</Text>
            <Switch
              value={containsNumeric}
              onValueChange={setContainsNumeric}
            />
          </View>
          <View style={styles.settingRow}>
            <Text>Incluir Maiusculas?</Text>
            <Switch
              value={containsUpperCase}
              onValueChange={setContainsUpperCase}
            />
          </View>
          <View style={styles.settingRow}>
            <Text>Incluir Caracteres Especiais?</Text>
            <Switch
              value={containsSpecialChar}
              onValueChange={setContainsSpecialChar}
            />
          </View>

          <Text style={styles.lengthText}>Tamanho da senha:</Text>
          <View style={styles.lengthControlRow}>
            <IconButton
              icon="minus"
              mode="outlined"
              onPress={() => incrementLength(-1)}
              disabled={length <= MIN_LENGTH}
            />

            <TextInput
              style={styles.lengthInput}
              value={length.toString()}
              onChangeText={handleLengthChange}
              onBlur={handleBlur}
              keyboardType="numeric"
              mode="outlined"
              maxLength={2}
            />

            <IconButton
              icon="plus"
              mode="outlined"
              onPress={() => incrementLength(1)}
              disabled={length >= MAX_LENGTH}
            />
          </View>
        </Card.Content>

        <Card.Actions>
          <Button icon="refresh" mode="contained" onPress={handleGenerate}>
            Gerar
          </Button>
          <Button icon="content-save-outline" onPress={showSaveDialog}>
            Salvar
          </Button>
        </Card.Actions>
      </Card>

      <Snackbar
        visible={snackbarVisible}
        onDismiss={onDismissSnackbar}
        duration={2000}
        action={{
          label: "OK",
          onPress: onDismissSnackbar,
        }}
      >
        {snackBarMessage}
      </Snackbar>

      <Dialog
        visible={saveDialogVisible}
        onDismiss={() => setSaveDialogVisible(false)}
      >
        <Dialog.Title>Salvar Senha</Dialog.Title>
        <Dialog.Content>
          <Text style={{ marginBottom: 15 }}>Onde esta senha será usada?</Text>
          <TextInput
            label="Nome do Site, App ou Serviço (URL)"
            value={siteName}
            onChangeText={setSiteName}
            mode="outlined"
            autoFocus
          />
        </Dialog.Content>
        <Dialog.Actions>
          <Button onPress={() => setSaveDialogVisible(false)}>Cancelar</Button>
          <Button
            onPress={handleSavePassword}
            disabled={siteName.trim() === ""}
          >
            Salvar
          </Button>
        </Dialog.Actions>
      </Dialog>
    </>
  );
}

const styles = StyleSheet.create({
  card: {
    margin: 16,
    elevation: 4,
  },
  input: {
    marginBottom: 10,
  },
  settingRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 8,
  },
  lengthText: {
    marginTop: 10,
    marginBottom: 5,
    fontWeight: "bold",
    textAlign: "center",
  },
  lengthControlRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginVertical: 10,
  },
  lengthInput: {
    flex: 1,
    marginHorizontal: 10,
    height: 40,
    textAlign: "center",
    paddingHorizontal: 0,
  },
  modal: {
    backgroundColor: "white",
    padding: 20,
    borderRadius: 20,
    justifyContent: "center",
    alignContent: "center",
    margin: 30,
  },
});
