import { api } from "@/service/api";
import { encryptVault } from "@/service/encrypt";
import { generateSalt } from "@/service/generateSalt";
import { deriveMasterKey, hashForLogin } from "@/service/hash";
import { useMutation } from "@tanstack/react-query";

export const useRegister = () =>
  useMutation({
    mutationFn: async (input: { email: string; masterKeyInput: string }) => {
      const saltBase64 = generateSalt();

      const masterKeyBuffer = deriveMasterKey(input.masterKeyInput, saltBase64);
      const loginPassword = hashForLogin(masterKeyBuffer);
      const masterKeyString = masterKeyBuffer.toString("base64");

      const encryptedVault = await encryptVault(masterKeyBuffer, [], saltBase64);

      const payloadToSend = {
        email: input.email,
        senha: loginPassword,
        kdfSalt: saltBase64,
        vaultIV: encryptedVault.iv,
        vaultTag: encryptedVault.tag,
        encryptedBlob: encryptedVault.encryptedData,
      };

      const { data } = await api.post("/usuarios/create", payloadToSend);

      return {
        encryptedBlob: encryptedVault.encryptedData,
        kdfSalt: saltBase64,
        vaultIV: encryptedVault.iv,
        vaultTag: encryptedVault.tag,
        masterKey: masterKeyString,
        userId: data.id,
        userEmail: data.email,
      };
    },
    onSuccess: (data) => {
      console.log("Registro realizado com sucesso", data);
      return data;
    },
    onError: (error) => {
      console.error("Erro ao registrar", error);
    },
  });

export const useDeleteAccount = () =>
  useMutation({
    mutationFn: async () => {
      try {
        await api.delete("/vaultData");
      } catch (error) {
        console.error("Falha ao apagar a conta: ", error);
      }
    },
  });
