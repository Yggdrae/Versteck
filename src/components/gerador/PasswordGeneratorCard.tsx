import { generatePassword } from "@/service/generatePassword";
import React, { useState } from "react";
import { StyleSheet, View } from "react-native";
import { Button, Card, IconButton, Switch, Text, TextInput } from "react-native-paper";

const MIN_LENGTH = 8;
const MAX_LENGTH = 64;

interface GeneratorCardProps {
  copyToClipboard: (pass: string) => void;
  showSaveDialog: (pass: string) => void;
}

export default function PasswordGeneratorCard({ copyToClipboard, showSaveDialog }: GeneratorCardProps) {
  const [generatedPassword, setGeneratedPassword] = useState("");
  const [containsNumeric, setContainsNumeric] = useState(true);
  const [containsLowerCase, setContainsLowerCase] = useState(true);
  const [containsUpperCase, setContainsUpperCase] = useState(true);
  const [containsSpecialChar, setContainsSpecialChar] = useState(true);
  const [length, setLength] = useState(32);

  const handleGenerate = () => {
    const newPass = generatePassword({
      length,
      containsNumeric,
      containsLowerCase,
      containsUpperCase,
      containsSpecialChar,
    });
    setGeneratedPassword(newPass);
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
              <TextInput.Icon icon="content-copy" onPress={() => copyToClipboard(generatedPassword)} />
            ) : null
          }
        />

        <View style={styles.settingRow}>
          <Text>Incluir Números?</Text>
          <Switch value={containsNumeric} onValueChange={setContainsNumeric} />
        </View>
        <View style={styles.settingRow}>
          <Text>Incluir Maiúsculas?</Text>
          <Switch value={containsUpperCase} onValueChange={setContainsUpperCase} />
        </View>
        <View style={styles.settingRow}>
          <Text>Incluir Caracteres Especiais?</Text>
          <Switch value={containsSpecialChar} onValueChange={setContainsSpecialChar} />
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

          <IconButton icon="plus" mode="outlined" onPress={() => incrementLength(1)} disabled={length >= MAX_LENGTH} />
        </View>
      </Card.Content>

      <Card.Actions style={styles.actions}>
        <Button icon="refresh" mode="contained" onPress={handleGenerate}>
          Gerar
        </Button>
        <Button
          icon="content-save-outline"
          mode="outlined"
          onPress={() => showSaveDialog(generatedPassword)}
          disabled={!generatedPassword}
        >
          Salvar
        </Button>
      </Card.Actions>
    </Card>
  );
}

const styles = StyleSheet.create({
  card: {
    margin: 16,
    elevation: 4,
    padding: 12,
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
  actions: {
    justifyContent: "space-between",
    paddingHorizontal: 16,
    marginTop: 8,
  },
});
