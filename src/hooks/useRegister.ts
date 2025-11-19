import { api } from "@/service/api";
import { encryptVault } from "@/service/encrypt";
import { generateSalt } from "@/service/generateSalt";
import { deriveMasterKey, hashForLogin } from "@/service/hash";
import { useMutation } from "@tanstack/react-query";

export const useRegister = () => useMutation({
    mutationFn: async (input: { email: string; masterKeyInput: string }) => {
        const saltBase64 = generateSalt();

        const masterKeyBuffer = deriveMasterKey(input.masterKeyInput, saltBase64);
        const loginPassword = hashForLogin(masterKeyBuffer);

        const masterKeyString = masterKeyBuffer.toString("base64");

        const encryptedVault = await encryptVault(masterKeyString, []);

        const payload = {
            email: input.email,
            password: loginPassword,
            kdfSalt: saltBase64,
            vaultIv: encryptedVault.iv,
            vaultTag: encryptedVault.tag,
            vaultData: encryptedVault.encryptedData,
        };

        const response = await api.post("/auth/register", payload);
        return response.data;
    },
    onSuccess: (data) => {
        console.log("Registro realizado com sucesso", data);
    },
    onError: (error) => {
        console.error("Erro ao registrar", error);
    }
});