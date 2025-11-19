import { ThemedSafeAreaView } from "@/components/ThemedSafeArea";
import { ThemedView } from "@/components/ThemedView";
import { useRegister } from "@/hooks/useRegister"; // Importe o novo hook
import { useUser } from "@/providers/userContext";
import { writeVaultFile } from "@/service/storage";
import { useRouter } from "expo-router";
import { useState } from "react";
import { Alert, Keyboard, StyleSheet, TouchableWithoutFeedback, View } from "react-native";
import { Avatar, Button, HelperText, Text, TextInput, useTheme } from "react-native-paper";

export default function Cadastro() {
    const paperTheme = useTheme();
    const { replace, back } = useRouter();
    const { setMasterKey } = useUser();

    const { mutateAsync: registerUser, isPending: isLoading } = useRegister();

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");

    const [showPassword, setShowPassword] = useState(false);

    const [emailError, setEmailError] = useState("");
    const [passwordError, setPasswordError] = useState("");
    const [confirmError, setConfirmError] = useState("");

    const validate = () => {
        let valid = true;

        if (!email || !email.includes("@")) {
            setEmailError("E-mail inválido");
            valid = false;
        } else {
            setEmailError("");
        }

        if (password.length < 6) {
            setPasswordError("A chave mestra deve ter pelo menos 6 caracteres");
            valid = false;
        } else {
            setPasswordError("");
        }

        if (password !== confirmPassword) {
            setConfirmError("As senhas não coincidem");
            valid = false;
        } else {
            setConfirmError("");
        }

        return valid;
    };

    const handleRegister = async () => {
        if (!validate()) return;

        Keyboard.dismiss();

        try {
            const response = await registerUser({
                email: email,
                masterKeyInput: password
            });

            const localPayload = {
                encryptedData: response.vaultData,
                salt: response.kdfSalt,
                iv: response.vaultIv,
                tag: response.vaultTag
            };

            await writeVaultFile(JSON.stringify(localPayload));

            setMasterKey(password);

            Alert.alert("Sucesso", "Conta criada com segurança!", [
                { text: "OK", onPress: () => replace("/(tabs)/home") }
            ]);

        } catch (err: any) {
            console.error(err);
            const msg = err?.response?.data?.message || "Falha ao criar conta. Tente novamente.";
            Alert.alert("Erro", msg);
        }
    };

    return (
        <ThemedSafeAreaView>
            <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
                <ThemedView style={styles.container}>

                    <View style={styles.header}>
                        <Avatar.Icon
                            size={80}
                            icon="account-plus"
                            style={{ backgroundColor: paperTheme.colors.primaryContainer }}
                            color={paperTheme.colors.primary}
                        />
                        <Text variant="headlineMedium" style={{ marginTop: 16, fontWeight: "bold", color: paperTheme.colors.primary }}>
                            Criar Conta
                        </Text>
                        <Text variant="bodyMedium" style={{ opacity: 0.6, textAlign: 'center', paddingHorizontal: 20 }}>
                            Seu cofre será criptografado com essa senha. Nós não podemos recuperá-la se você esquecer.
                        </Text>
                    </View>

                    <View style={styles.form}>
                        <TextInput
                            label="E-mail"
                            mode="outlined"
                            value={email}
                            onChangeText={setEmail}
                            error={!!emailError}
                            disabled={isLoading}
                            keyboardType="email-address"
                            autoCapitalize="none"
                        />
                        <HelperText type="error" visible={!!emailError}>{emailError}</HelperText>

                        <TextInput
                            label="Chave Mestra (Senha)"
                            mode="outlined"
                            value={password}
                            onChangeText={setPassword}
                            secureTextEntry={!showPassword}
                            error={!!passwordError}
                            disabled={isLoading}
                            right={
                                <TextInput.Icon
                                    icon={showPassword ? "eye-off" : "eye"}
                                    onPress={() => setShowPassword(!showPassword)}
                                />
                            }
                        />
                        <HelperText type="error" visible={!!passwordError}>{passwordError}</HelperText>

                        <TextInput
                            label="Confirmar Chave Mestra"
                            mode="outlined"
                            value={confirmPassword}
                            onChangeText={setConfirmPassword}
                            secureTextEntry={!showPassword}
                            error={!!confirmError}
                            disabled={isLoading}
                        />
                        <HelperText type="error" visible={!!confirmError}>{confirmError}</HelperText>

                        <View style={styles.buttons}>
                            <Button
                                mode="contained"
                                onPress={handleRegister}
                                loading={isLoading}
                                disabled={isLoading}
                                contentStyle={{ height: 50 }}
                            >
                                Criar Cofre
                            </Button>

                            <Button
                                mode="outlined"
                                onPress={() => back()}
                                disabled={isLoading}
                                contentStyle={{ height: 50 }}
                            >
                                Voltar para Login
                            </Button>
                        </View>
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
    buttons: {
        marginTop: 10,
        gap: 10
    }
});